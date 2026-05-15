const { prisma } = require('../config/database');
const quotationService = require('../modules/quotations/quotation.service');

// Auto-release escrow for bookings stale beyond timeout (12 hours)
async function runEscrowTimeoutJob() {
  const BOOKING_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours
  const QUOTATION_TIMEOUT_MS = 48 * 60 * 60 * 1000; // 48 hours (Phase 3.5)
  const now = new Date();
  const bookingCutoff = new Date(now.getTime() - BOOKING_TIMEOUT_MS);
  const quotationCutoff = new Date(now.getTime() - QUOTATION_TIMEOUT_MS);

  console.log('[Escrow Job] Starting escrow timeout check...');

  // Phase 2: Auto-release for stale bookings (12-hour timeout)
  try {
  const staleBookings = await prisma.booking.findMany({
    where: {
      status: 'ACCEPTED',
        updatedAt: { lt: bookingCutoff }
    }
  });

  console.log(`[Escrow Job] Found ${staleBookings.length} stale bookings for auto-release`);

  for (const booking of staleBookings) {
    try {
      // Mark as completed and release escrow
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'COMPLETED', completedAt: new Date() }
      });

      // Create escrow release transaction
      await prisma.transaction.create({
        data: {
          userId: booking.providerId,
          bookingId: booking.id,
          type: 'ESCROW_RELEASE',
          status: 'SUCCESS',
          amount: booking.amount,
          currency: booking.currency,
          squadRef: `auto_release_${booking.id}`,
          squadEvent: 'escrow.auto_released',
            metadata: { autoReleased: true, timeout: BOOKING_TIMEOUT_MS }
        }
      });

      console.log(`[Escrow Job] Auto-released escrow for booking ${booking.id}`);
    } catch (error) {
      console.error(`[Escrow Job] Failed to auto-release booking ${booking.id}:`, error);
    }
  }
  } catch (error) {
    console.error('[Escrow Job] Error checking stale bookings:', error);
  }

  // Phase 3.5: Force-release labour escrow for quotations over 48 hours old
  try {
    const overdueQuotations = await prisma.quotation.findMany({
      where: {
        status: 'ACCEPTED',
        acceptedAt: { lt: quotationCutoff },
        labourReleasedAt: null // Not yet released
      },
      include: { booking: true }
    });

    console.log(`[Escrow Job] Found ${overdueQuotations.length} quotations with overdue labour escrow`);

    for (const quotation of overdueQuotations) {
      try {
        // Force-release labour escrow
        await quotationService.forceReleaseLaborEscrow(quotation.id);

        // Create labour release transaction
        await prisma.transaction.create({
          data: {
            userId: quotation.booking.providerId,
            bookingId: quotation.bookingId,
            type: 'ESCROW_RELEASE',
            status: 'SUCCESS',
            amount: quotation.finalLabourCost || 0,
            currency: 'NGN',
            squadRef: `labour_force_release_${quotation.id}`,
            squadEvent: 'quotation.labour_force_released',
            metadata: {
              autoReleased: true,
              reason: 'timeout_48h',
              quotationId: quotation.id,
              timeout: QUOTATION_TIMEOUT_MS
            }
          }
        });

        console.log(`[Escrow Job] Force-released labour escrow for quotation ${quotation.id}`);
      } catch (error) {
        console.error(`[Escrow Job] Failed to force-release quotation ${quotation.id}:`, error);
      }
    }
  } catch (error) {
    console.error('[Escrow Job] Error checking overdue quotations:', error);
  }
}

module.exports = {
  runEscrowTimeoutJob
};
