const { getPrismaClient } = require('../../config/database');

function createTransactionService({ prisma = getPrismaClient() } = {}) {
  async function getUserTransactionSummary(userId) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const totalEarnings = transactions
      .filter((transaction) => transaction.status === 'SUCCESS' && ['ESCROW_RELEASE', 'WALLET_CREDIT'].includes(transaction.type))
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    return { transactions, totalEarnings };
  }

  async function monthlyEarningsSummary(providerUserId) {
    return prisma.$queryRaw`
      SELECT
        date_trunc('month', t."createdAt")::date AS month,
        COALESCE(SUM(t.amount), 0) AS total
      FROM "Transaction" t
      WHERE t."userId" = ${providerUserId}
        AND t.status = 'SUCCESS'
        AND t.type IN ('ESCROW_RELEASE', 'WALLET_CREDIT')
      GROUP BY 1
      ORDER BY 1
    `;
  }

  async function topServices(providerUserId, limit = 5) {
    return prisma.$queryRaw`
      SELECT
        b."serviceId" AS "serviceId",
        COUNT(*)::int AS count
      FROM "Booking" b
      WHERE b."providerId" = ${providerUserId}
        AND b.status = 'COMPLETED'
      GROUP BY b."serviceId"
      ORDER BY count DESC
      LIMIT ${limit}
    `;
  }

  async function getProviderAnalytics(providerUserId) {
    const [summary, monthlyEarnings, topServicesResult, recentTransactions] = await Promise.all([
      getUserTransactionSummary(providerUserId),
      monthlyEarningsSummary(providerUserId),
      topServices(providerUserId),
      prisma.transaction.findMany({
        where: { userId: providerUserId },
        orderBy: { createdAt: 'desc' },
        take: 12
      })
    ]);

    return {
      summary,
      monthlyEarnings,
      topServices: topServicesResult,
      recentTransactions
    };
  }

  return {
    getUserTransactionSummary,
    monthlyEarningsSummary,
    topServices,
    getProviderAnalytics
  };
}

const defaultTransactionService = createTransactionService();

module.exports = {
  createTransactionService,
  ...defaultTransactionService
};