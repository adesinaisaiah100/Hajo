const { prisma } = require('../config/database');

// Auto-release escrow for bookings stale beyond timeout (12 hours)
async function runEscrowTimeoutJob() {
  const TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours
  const now = new Date();
  const cutoff = new Date(now.getTime() - TIMEOUT_MS);

  // Find accepted bookings that haven't been completed or cancelled
  const staleBookings = await prisma.booking.findMany({
    where: {
      status: 'ACCEPTED',
      updatedAt: { lt: cutoff }
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
          metadata: { autoReleased: true, timeout: TIMEOUT_MS }
        }
      });

      console.log(`[Escrow Job] Auto-released escrow for booking ${booking.id}`);
    } catch (error) {
      console.error(`[Escrow Job] Failed to auto-release booking ${booking.id}:`, error);
    }
  }
}

module.exports = {
  runEscrowTimeoutJob
};
