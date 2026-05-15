const { getPrismaClient } = require('../../config/database');
const { calculateScore, getTier } = require('../scoring/scoring.service');

function toNumber(value) {
  if (value == null) return 0;
  const next = Number(value);
  return Number.isNaN(next) ? 0 : next;
}

function createScoringService({ prisma = getPrismaClient() } = {}) {
  async function loadProvider(providerUserId) {
    const provider = await prisma.provider.findUnique({
      where: { userId: providerUserId },
      include: { user: true }
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const [reviewStats, recentCompletedBookings, recentTransactions] = await Promise.all([
      prisma.review.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { providerId: provider.id }
      }),
      prisma.booking.count({
        where: {
          providerId: providerUserId,
          status: 'COMPLETED'
        }
      }),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId: providerUserId,
          status: 'SUCCESS',
          type: { in: ['ESCROW_RELEASE', 'WALLET_CREDIT'] }
        }
      })
    ]);

    const normalizedProvider = {
      ...provider,
      completedJobs: recentCompletedBookings ?? provider.completedJobs ?? 0,
      totalEarnings: toNumber(recentTransactions._sum.amount ?? provider.totalEarnings ?? 0),
      averageRating: reviewStats._avg.rating ?? provider.averageRating ?? 0
    };

    return {
      provider: normalizedProvider,
      reviewCount: reviewStats._count.rating
    };
  }

  async function getProviderScoreBreakdown(providerUserId) {
    const { provider, reviewCount } = await loadProvider(providerUserId);
    const scores = calculateScore(provider);
    const tier = getTier(scores.totalScore);
    const narrative = `Provider has completed ${provider.completedJobs} jobs with ${provider.averageRating || 0} avg rating. Total earnings: ₦${provider.totalEarnings}.`;

    return {
      providerId: providerUserId,
      score: scores.totalScore,
      tier,
      breakdown: {
        jobsScore: scores.jobsScore,
        earningsScore: scores.earningsScore,
        ratingScore: scores.ratingScore,
        tenureScore: scores.tenureScore
      },
      narrative,
      metrics: {
        completedJobs: provider.completedJobs,
        totalEarnings: toNumber(provider.totalEarnings),
        averageRating: toNumber(provider.averageRating),
        reviewCount
      }
    };
  }

  async function refreshProviderScore(providerUserId) {
    const breakdown = await getProviderScoreBreakdown(providerUserId);
    const provider = await prisma.provider.findUnique({
      where: { userId: providerUserId }
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const scoreRecordData = {
      userId: providerUserId,
      providerId: provider.id,
      score: breakdown.score,
      tier: breakdown.tier,
      jobsScore: breakdown.breakdown.jobsScore,
      earningsScore: breakdown.breakdown.earningsScore,
      ratingScore: breakdown.breakdown.ratingScore,
      tenureScore: breakdown.breakdown.tenureScore,
      narrative: breakdown.narrative
    };

    const [creditScore, scoreSnapshot] = await Promise.all([
      prisma.creditScore.create({ data: scoreRecordData }),
      prisma.scoreSnapshot.create({ data: scoreRecordData })
    ]);

    return {
      ...breakdown,
      creditScore,
      scoreSnapshot
    };
  }

  async function refreshAllProviderScores({ limit = 200 } = {}) {
    const providers = await prisma.provider.findMany({
      take: limit,
      select: { userId: true }
    });

    const results = [];
    for (const provider of providers) {
      try {
        results.push(await refreshProviderScore(provider.userId));
      } catch (error) {
        results.push({ providerId: provider.userId, error: error.message });
      }
    }

    return results;
  }

  return {
    getProviderScoreBreakdown,
    refreshProviderScore,
    refreshAllProviderScores
  };
}

const defaultScoringService = createScoringService();

module.exports = {
  createScoringService,
  getProviderScoreBreakdown: defaultScoringService.getProviderScoreBreakdown,
  refreshProviderScore: defaultScoringService.refreshProviderScore,
  refreshAllProviderScores: defaultScoringService.refreshAllProviderScores
};const { prisma } = require('../../config/database');

async function getScoreBreakdown(userId) {
  // Basic metrics — adapt to real scoring model later
  const completedBookings = await prisma.booking.count({ where: { userId, status: 'completed' } }).catch(() => 0);
  const totalEarningsRow = await prisma.transaction.aggregate({ _sum: { amount: true }, where: { userId } }).catch(() => ({ _sum: { amount: 0 } }));
  const totalEarnings = totalEarningsRow._sum.amount || 0;
  const avgRatingRow = await prisma.review.aggregate({ _avg: { rating: true }, where: { providerId: userId } }).catch(() => ({ _avg: { rating: null } }));
  const avgRating = avgRatingRow._avg.rating || null;

  const components = {
    activityScore: Math.min(100, completedBookings * 2),
    earningsScore: Math.min(100, Math.floor(totalEarnings / 1000)),
    ratingScore: avgRating ? Math.round((avgRating / 5) * 100) : 50,
  };

  const overall = Math.round((components.activityScore * 0.4) + (components.earningsScore * 0.35) + (components.ratingScore * 0.25));

  return { userId, overall, components, meta: { completedBookings, totalEarnings, avgRating } };
}

module.exports = { getScoreBreakdown };
