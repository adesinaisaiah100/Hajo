const { prisma } = require('../../config/database');
const crypto = require('crypto');
const { getEnv } = require('../../config/env');

// Verify Squad webhook signature
function verifyWebhookSignature(payload, signature) {
  const env = getEnv();
  if (!env.SQUAD_WEBHOOK_SECRET) return true; // Skip verification in development

  const hash = crypto.createHmac('sha256', env.SQUAD_WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');
  return hash === signature;
}

// Handle Squad webhook event (idempotent)
async function handleSquadEvent(event) {
  const { event_type, data } = event || {};

  // Map Squad reference
  const transactionRef = data?.transaction_ref || data?.transactionRef || data?.gateway_ref || data?.reference;
  const transactionStatus = data?.status || data?.transaction_status || data?.status_description;

  if (!transactionRef) {
    console.warn('[Squad Webhook] No transaction reference found in event');
    return;
  }

  // Find existing transaction (idempotency check)
  const existing = await prisma.transaction.findUnique({ where: { squadRef: transactionRef } });
  if (existing) {
    console.log(`[Squad Webhook] Transaction already processed: ${transactionRef}`);
    return; // Already processed
  }

  // Map event status to internal status
  const internalStatus = /success/i.test(String(transactionStatus))
    ? 'SUCCESS'
    : /failed|decline/i.test(String(transactionStatus))
    ? 'FAILED'
    : 'PENDING';

  // Create transaction record from webhook
  const trx = await prisma.transaction.create({
    data: {
      userId: data?.customer_id || data?.userId || 'unknown',
      type: 'WALLET_CREDIT',
      status: internalStatus,
      amount: data?.amount || 0,
      currency: data?.currency || 'NGN',
      squadRef: transactionRef,
      squadEvent: event_type,
      rawPayload: data
    }
  });

  console.log(`[Squad Webhook] Processed event ${event_type} for ${transactionRef}, status: ${internalStatus}`);

  return trx;
}

module.exports = {
  verifyWebhookSignature,
  handleSquadEvent
};
