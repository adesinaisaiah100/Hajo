const { getPrismaClient } = require('../../config/database');
const { getRedis } = require('../../config/redis');
const { createGeminiClient } = require('../../integrations/gemini/gemini.client');
const { createTransactionService } = require('../transactions/transaction.service');

function toNumber(value) {
  if (value == null) return 0;
  const next = Number(value);
  return Number.isNaN(next) ? 0 : next;
}

function buildFallbackInsights(metrics) {
  const topService = metrics.topServices[0]?.serviceId || 'your most popular service';
  const monthlyGrowth = metrics.monthlyEarnings.length > 1
    ? toNumber(metrics.monthlyEarnings.at(-1)?.total) - toNumber(metrics.monthlyEarnings.at(-2)?.total)
    : 0;

  return {
    summary: `${metrics.displayName} has ${metrics.completedJobs} completed jobs and an average rating of ${metrics.averageRating.toFixed(1)}.`,
    trends: [
      { label: 'Top service', value: topService },
      { label: 'Monthly earnings change', value: monthlyGrowth >= 0 ? `+₦${monthlyGrowth.toFixed(2)}` : `-₦${Math.abs(monthlyGrowth).toFixed(2)}` },
      { label: 'Recent bookings', value: `${metrics.recentBookings.length} tracked` }
    ],
    recommendations: [
      'Promote your highest-rated service in the dashboard.',
      'Follow up customers after completed jobs to keep ratings high.',
      'Keep availability updated so search results stay accurate.'
    ]
  };
}

function createInsightsService({
  prisma = getPrismaClient(),
  redisClient = getRedis(),
  aiClient = createGeminiClient(),
  transactionService = createTransactionService({ prisma }),
  cacheTtlSeconds = 86400,
  refreshCooldownSeconds = 300
} = {}) {
  async function buildMetrics(providerUserId) {
    const provider = await prisma.provider.findUnique({
      where: { userId: providerUserId },
      include: { user: true }
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const [monthlyEarnings, topServices, recentBookings, reviewStats] = await Promise.all([
      transactionService.monthlyEarningsSummary(providerUserId),
      transactionService.topServices(providerUserId),
      prisma.booking.findMany({
        where: { providerId: providerUserId },
        orderBy: { createdAt: 'desc' },
        take: 12
      }),
      prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { providerId: provider.id }
      })
    ]);

    const completedJobs = provider.completedJobs || recentBookings.filter((booking) => booking.status === 'COMPLETED').length;
    const averageRating = toNumber(reviewStats._avg.rating ?? provider.averageRating ?? 0);

    return {
      providerId: providerUserId,
      displayName: provider.tradeName || `${provider.user.firstName} ${provider.user.lastName}`,
      completedJobs,
      totalEarnings: toNumber(provider.totalEarnings),
      averageRating,
      monthlyEarnings,
      topServices,
      recentBookings,
      reviewCount: reviewStats._count.rating
    };
  }

  async function getProviderInsights(providerUserId, { forceRefresh = false } = {}) {
    const cacheKey = `insights:provider:${providerUserId}`;
    const cooldownKey = `${cacheKey}:cooldown`;

    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached && !forceRefresh) {
        return JSON.parse(cached);
      }

      if (cached && forceRefresh) {
        const cooldownActive = await redisClient.get(cooldownKey);
        if (cooldownActive) {
          return JSON.parse(cached);
        }
      }
    }

    const metrics = await buildMetrics(providerUserId);
    const prompt = [
      'You are the Hajo provider insights engine.',
      'Return a JSON object with summary, trends, and recommendations.',
      `Provider metrics: ${JSON.stringify(metrics)}`
    ].join('\n');

    let generated = await aiClient.generateInsights(prompt);
    if (!generated) {
      generated = buildFallbackInsights(metrics);
    }

    const response = {
      providerId: providerUserId,
      generatedAt: new Date().toISOString(),
      ...generated
    };

    if (redisClient) {
      await redisClient.set(cacheKey, JSON.stringify(response), 'EX', cacheTtlSeconds);
      await redisClient.set(cooldownKey, '1', 'EX', refreshCooldownSeconds);
    }

    return response;
  }

  return {
    getProviderInsights
  };
}

const defaultInsightsService = createInsightsService();

module.exports = {
  createInsightsService,
  getProviderInsights: defaultInsightsService.getProviderInsights
};