const { prisma } = require('../../config/database');
const { chargeEscrow, initiateHostedPayment } = require('../../integrations/squad/payment');
const { transferRelease } = require('../../integrations/squad/squad.transfer');
const { createTransaction, updateStatus } = require('../transactions/transaction.service');
const { getEnv } = require('../../config/env');

// Create booking (initial request)
async function createBooking({ customerId, providerId, serviceId, amount, currency = 'NGN', scheduledAt, notes }) {
  const booking = await prisma.booking.create({
    data: {
      customerId,
      providerId,
      serviceId,
      amount,
      currency,
      scheduledAt,
      notes,
      status: 'PENDING'
    }
  });

  const transactionRef = `sb_booking_${booking.id}`;

  const payment = await initiateHostedPayment({
    amount: Number(amount),
    currency,
    email: '',
    customer_name: '',
    transaction_ref: transactionRef,
    callback_url: getEnv().NEXT_PUBLIC_APP_URL + '/payments/callback',
    metadata: { bookingId: booking.id }
  });

  const trx = await createTransaction({
    userId: customerId,
    bookingId: booking.id,
    type: 'ESCROW_CHARGE',
    amount,
    currency,
    squadRef: payment.gateway_ref || payment.transaction_ref || `mock_${transactionRef}`,
    squadEvent: 'booking.created',
    metadata: payment
  });

  // Phase 3.5: Trigger quotation generation asynchronously
  try {
    const quotationService = require('../quotations/quotation.service');
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    const customer = await prisma.user.findUnique({ where: { id: customerId } });
    
    if (service && customer) {
      await quotationService.generateDraft(
        booking.id,
        {
          firstName: customer.firstName,
          lastName: customer.lastName,
          city: customer.city,
        },
        {
          title: service.title,
          description: service.description,
          priceFrom: service.price,
          priceTo: service.price,
        }
      );
      console.log(`[Booking] Quotation generated for booking ${booking.id}`);
    }
  } catch (error) {
    console.error(`[Booking] Failed to generate quotation for booking ${booking.id}:`, error.message);
    // Don't fail the booking if quotation generation fails
  }

  return { booking, transaction: trx, checkout: payment.checkout_url || null };
}

// Provider accepts booking (charges escrow)
async function acceptBooking(bookingId, providerId) {
  const booking = await prisma.booking.findUnique({ 
    where: { id: bookingId },
    include: { quotation: true }
  });
  if (!booking || booking.providerId !== providerId) throw new Error('Booking not found or unauthorized');
  
  // If quotation exists, it must be accepted via quotationService.acceptQuotation by the customer
  if (booking.quotation) {
    throw new Error('This booking requires a quotation. It must be accepted by the customer.');
  }

  if (booking.status !== 'PENDING') throw new Error('Booking cannot be accepted in current state');

  const chargeRef = `sb_accept_${bookingId}`;
  const charge = await chargeEscrow({
    amount: Number(booking.amount),
    currency: booking.currency,
    email: '',
    customer_name: '',
    transaction_ref: chargeRef,
    bookingId,
    metadata: { action: 'booking_accept' }
  });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'ACCEPTED', squadEscrowRef: charge.gateway_ref || charge.transaction_ref }
  });

  await createTransaction({
    userId: booking.customerId,
    bookingId,
    type: 'ESCROW_CHARGE',
    amount: booking.amount,
    currency: booking.currency,
    squadRef: charge.gateway_ref || charge.transaction_ref || `mock_${chargeRef}`,
    squadEvent: 'booking.accepted',
    metadata: charge
  });

  return updated;
}

// Complete booking (release escrow to provider)
async function completeBooking(bookingId, customerId) {
  const booking = await prisma.booking.findUnique({ 
    where: { id: bookingId },
    include: { quotation: true }
  });
  if (!booking || booking.customerId !== customerId) throw new Error('Booking not found or unauthorized');
  if (booking.status !== 'ACCEPTED') throw new Error('Booking must be accepted before completion');

  // Handle Quotation-based completion (Split Escrow)
  if (booking.quotation) {
    const quotationService = require('../quotations/quotation.service');
    await quotationService.releaseLaborEscrow(booking.quotation.id);
    
    // Status update is handled by releaseLaborEscrow or handleLabourEscrowRelease
    return findBookingById(bookingId);
  }

  // Handle standard booking completion
  const transferRef = `sb_release_${bookingId}`;
  const provider = await prisma.provider.findUnique({ where: { userId: booking.providerId } });

  // Mock: provider account would be their Squad virtual account
  const providerAccount = '0123456789'; // In production, use provider.squadAccountNo

  const release = await transferRelease({
    amount: Number(booking.amount),
    currency: booking.currency,
    transfer_ref: transferRef,
    provider_account: providerAccount,
    bookingId,
    metadata: { action: 'booking_complete' }
  });

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'COMPLETED', completedAt: new Date() }
  });

  await createTransaction({
    userId: booking.providerId,
    bookingId,
    type: 'ESCROW_RELEASE',
    amount: booking.amount,
    currency: booking.currency,
    squadRef: release.gateway_ref || release.transfer_ref || `mock_${transferRef}`,
    squadEvent: 'booking.completed',
    metadata: release
  });

  // Update provider earnings
  await prisma.provider.update({
    where: { userId: booking.providerId },
    data: { totalEarnings: { increment: Number(booking.amount) } }
  });

  return updated;
}

// Cancel booking (refund escrow)
async function cancelBooking(bookingId, reason) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error('Booking not found');
  if (booking.status === 'COMPLETED') throw new Error('Cannot cancel completed booking');

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED', cancelledAt: new Date() }
  });

  // Record refund transaction
  await createTransaction({
    userId: booking.customerId,
    bookingId,
    type: 'REFUND',
    amount: booking.amount,
    currency: booking.currency,
    squadRef: `mock_refund_${bookingId}`,
    squadEvent: 'booking.cancelled',
    metadata: { reason }
  });

  return updated;
}

async function findBookingById(id) {
  return prisma.booking.findUnique({ where: { id }, include: { customer: true, provider: true, service: true } });
}

module.exports = {
  createBooking,
  acceptBooking,
  completeBooking,
  cancelBooking,
  findBookingById
};
