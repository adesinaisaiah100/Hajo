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

  // Phase 3.5: Handle labour escrow release on transfer success
  const isTransferSuccess = internalStatus === 'SUCCESS' && (event_type === 'transfer.success' || event_type === 'payout.success');
  const isLabourRef = /LAB|labour/i.test(transactionRef);

  if (isTransferSuccess && isLabourRef) {
    try {
      await handleLabourEscrowRelease(event, trx);
    } catch (error) {
      console.error('[Squad Webhook] Failed to process labour escrow release:', error.message);
    }
  }

  return trx;
}

/**
 * Phase 3.5: Handle labour escrow release
 * Called when Squad webhook indicates labour portion transfer was successful
 */
async function handleLabourEscrowRelease(event, transaction) {
  const { data } = event || {};
  
  // Find booking and quotation associated with this transfer
  const quotation = await prisma.quotation.findFirst({
    where: {
      squadLabourRef: data?.transaction_ref || data?.reference,
    },
    include: { booking: true },
  });

  if (!quotation || !quotation.booking) {
    console.log('[Squad Webhook] No quotation found for labour release, skipping');
    return;
  }

  // Mark labour as released in quotation
  await prisma.quotation.update({
    where: { id: quotation.id },
    data: {
      status: 'COMPLETED',
      labourReleasedAt: new Date(),
    },
  });

  // Update booking to COMPLETED if not already
  if (quotation.booking.status !== 'COMPLETED') {
    await prisma.booking.update({
      where: { id: quotation.booking.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });
  }

  console.log(
    `[Squad Webhook] Labour escrow released for quotation ${quotation.id}, booking ${quotation.booking.id}`
  );
}

module.exports = {
  verifyWebhookSignature,
  handleSquadEvent
};
