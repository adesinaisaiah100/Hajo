const { prisma } = require('../../config/database');
const { geminiClient } = require('../../integrations/gemini/gemini.client');

/**
 * Match and rank providers based on a natural language query
 */
async function matchProviders(query, filters = {}) {
  const { city, minRating = 0, limit = 15 } = filters;

  // 1. Fetch relevant providers from DB first (Spatial/Category filtering)
  const providers = await prisma.provider.findMany({
    where: {
      verificationStatus: 'verified',
      averageRating: { gte: minRating },
      user: {
        city: city || undefined,
      },
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          city: true,
          verificationTier: true,
        },
      },
    },
    take: 50, // Fetch a pool for AI to rank
  });

  if (providers.length === 0) return [];

  // 2. Prepare context for Gemini
  const providerPool = providers.map((p) => ({
    id: p.id,
    name: `${p.user.firstName} ${p.user.lastName}`,
    tradeName: p.tradeName,
    category: p.category,
    bio: p.bio,
    rating: p.averageRating,
    jobs: p.completedJobs,
    tier: p.user.verificationTier,
    location: p.user.city,
  }));

  const prompt = `
You are an intelligent matching engine for Hajo, a Nigerian services marketplace.
User Query: "${query}"

Below is a list of verified service providers. Rank the top ${limit} providers that best match the user's needs.
Return ONLY a JSON array of objects with "id", "rank" (1-10), and "matchReason" (one short sentence).

Providers:
${JSON.stringify(providerPool, null, 2)}

Considerations:
- Trade relevance to the query
- Experience and rating
- Verification tier (Platinum/Gold are higher trust)
- Location proximity (if mentioned in query)
`;

  try {
    const rankings = await geminiClient.generateInsights(prompt);
    
    if (!rankings || !Array.isArray(rankings)) {
      console.warn('[AI Match] Gemini returned invalid format, using default sorting');
      return providers.slice(0, limit).map(p => ({ ...p, matchReason: 'Top rated professional' }));
    }

    // 3. Enrich and sort the results based on AI rankings
    const rankedResults = rankings
      .map((rank) => {
        const provider = providers.find((p) => p.id === rank.id);
        if (!provider) return null;
        return {
          ...provider,
          matchReason: rank.matchReason,
          aiRank: rank.rank,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.aiRank - b.aiRank);

    return rankedResults;
  } catch (error) {
    console.error('[AI Match] Gemini matching failed:', error.message);
    // Fallback: Return by rating
    return providers
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit)
      .map(p => ({ ...p, matchReason: 'Verified professional with good reviews' }));
  }
}

module.exports = {
  matchProviders,
};
