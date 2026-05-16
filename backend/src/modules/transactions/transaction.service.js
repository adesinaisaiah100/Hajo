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

  async function createTransaction(data) {
    const { userId, bookingId, type, amount, currency, squadRef, squadEvent, metadata } = data;
    
    // Simple idempotency check
    if (squadRef) {
      const existing = await prisma.transaction.findUnique({ where: { squadRef } });
      if (existing) return existing;
    }  

    return prisma.transaction.create({
      data: {
        userId,
        bookingId,
        type,
        amount,
        currency: currency || 'NGN',
        squadRef,
        squadEvent,
        metadata: metadata || {},
        status: 'SUCCESS' // For demo purposes, we mark them as SUCCESS immediately
      }
    });
  }

  async function findBySquadRef(squadRef) {
    return prisma.transaction.findUnique({ where: { squadRef } });
  }

  async function updateStatus(squadRef, status) {
    return prisma.transaction.update({
      where: { squadRef },
      data: { status }
    });
  }

  return {
    getUserTransactionSummary,
    monthlyEarningsSummary,
    topServices,
    getProviderAnalytics,
    createTransaction,
    findBySquadRef,
    updateStatus
  };
}

const defaultTransactionService = createTransactionService();

module.exports = {
  createTransactionService,
  ...defaultTransactionService
};