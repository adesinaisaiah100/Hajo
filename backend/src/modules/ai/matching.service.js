const { prisma } = require('../../config/database');
const { geminiClient } = require('../../integrations/gemini/gemini.client');

/**
 * Agentic Search: Extracts intent and filters, queries DB, and refines results.
 */
async function matchProviders(query, filters = {}) {
  // 1. Extraction Phase - Ask Gemini to understand the query and return search filters
  const extractionPrompt = `
You are a Hajo Search Agent. Extract search filters from this query: "${query}"
The city mentioned might be "${filters.city || 'any'}".

Respond with ONLY a JSON object:
{
  "category": "Electrician" | "Plumber" | "Tailor" | "Barber" | "Hair Stylist" | "Carpenter" | "Cleaner" | "Event Planner" | "Caterer" | "Painter" | null,
  "city": "string or null",
  "minRating": number (0-5),
  "maxPrice": number or null,
  "keywords": ["string"],
  "intent": "string (brief summary of what they need)"
}
`;

  let extractedFilters = { category: null, city: filters.city || null, minRating: 0, maxPrice: null, keywords: [] };
  try {
    const aiFilters = await geminiClient.generateInsights(extractionPrompt);
    if (aiFilters && typeof aiFilters === 'object') {
      extractedFilters = { ...extractedFilters, ...aiFilters };
    }
  } catch (error) {
    console.error('[Search Agent] Extraction failed:', error.message);
  }

  // 2. Database Phase - Query Prisma with extracted filters
  const where = {
    verificationStatus: 'verified',
    averageRating: { gte: extractedFilters.minRating || 0 },
  };

  if (extractedFilters.category) {
    where.category = extractedFilters.category;
  }

  if (extractedFilters.city || filters.city) {
    where.user = {
      city: extractedFilters.city || filters.city,
    };
  }

  if (extractedFilters.maxPrice) {
    where.priceFrom = { lte: extractedFilters.maxPrice };
  }

  // Keyword search in bio/tradeName if keywords exist
  if (extractedFilters.keywords && extractedFilters.keywords.length > 0) {
    where.OR = extractedFilters.keywords.map(keyword => ({
      OR: [
        { bio: { contains: keyword, mode: 'insensitive' } },
        { tradeName: { contains: keyword, mode: 'insensitive' } },
      ]
    }));
  }

  const providers = await prisma.provider.findMany({
    where,
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          city: true,
          verificationTier: true,
          avatarUrl: true,
        },
      },
      reviews: {
        take: 3,
        orderBy: { createdAt: 'desc' }
      }
    },
    take: 20,
  });

  if (providers.length === 0) {
    // Broaden search if no results
    return prisma.provider.findMany({
      where: { verificationStatus: 'verified', category: extractedFilters.category || undefined },
      include: {
        user: { select: { firstName: true, lastName: true, city: true, verificationTier: true, avatarUrl: true } }
      },
      take: 5
    }).then(results => results.map(p => ({ ...p, matchReason: 'Highly rated in your category' })));
  }

  // 3. Refinement Phase - Use AI to explain WHY these match the specific intent
  const providerContext = providers.map(p => ({
    id: p.id,
    name: p.user.firstName,
    tradeName: p.tradeName,
    bio: p.bio,
    tier: p.user.verificationTier,
  }));

  const refinementPrompt = `
User wanted: "${query}" (Intent: ${extractedFilters.intent || 'General search'})
Artisans found: ${JSON.stringify(providerContext)}

For each artisan, provide a "matchReason" that explains why they fit this specific request.
Return ONLY a JSON object mapping id to matchReason string: {"id": "reason"}
`;

  try {
    const matchReasons = await geminiClient.generateInsights(refinementPrompt);
    return providers.map(p => ({
      ...p,
      matchReason: matchReasons?.[p.id] || `Verified ${p.category} in ${p.user.city}`
    }));
  } catch (error) {
    return providers.map(p => ({ ...p, matchReason: `Verified ${p.category} professional` }));
  }
}

module.exports = {
  matchProviders,
};
