const { prisma } = require('../../config/database');

// Find transaction by Squad reference (idempotency check)
async function findBySquadRef(squadRef) {
  return prisma.transaction.findUnique({ where: { squadRef } });
}

// Create transaction record
async function createTransaction({ userId, bookingId, type, amount, currency = 'NGN', squadRef, squadEvent, metadata = {}, rawPayload = {} }) {
  // Idempotency: check if squadRef already exists
  const existing = await findBySquadRef(squadRef);
  if (existing) return existing;

  return prisma.transaction.create({
    data: {
      userId,
      bookingId,
      type,
      status: 'PENDING',
      amount,
      currency,
      squadRef,
      squadEvent,
      metadata,
      rawPayload
    }
  });
}

// Update transaction status
async function updateStatus(transactionId, status, rawPayload = {}) {
  return prisma.transaction.update({ where: { id: transactionId }, data: { status, rawPayload } });
}

// Get transaction summary for user
async function getUserTransactionSummary(userId) {
  const transactions = await prisma.transaction.findMany({ where: { userId } });
  const totalEarnings = transactions
    .filter(t => t.status === 'SUCCESS' && ['ESCROW_RELEASE', 'WALLET_CREDIT'].includes(t.type))
    .reduce((sum, t) => sum + Number(t.amount), 0);
  return { transactions, totalEarnings };
}

module.exports = {
  findBySquadRef,
  createTransaction,
  updateStatus,
  getUserTransactionSummary
};
