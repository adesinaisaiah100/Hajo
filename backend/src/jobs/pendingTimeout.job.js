const { prisma } = require('../config/database');

// Auto-cancel bookings that have been PENDING or QUOTE_REQUESTED for more than 24 hours
async function runPendingTimeoutJob() {
  const timeoutLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const overdueBookings = await prisma.booking.findMany({
      where: {
        status: { in: ['PENDING', 'QUOTE_REQUESTED'] },
        createdAt: { lt: timeoutLimit },
      },
    });

    console.log(`[Pending Job] Found ${overdueBookings.length} overdue bookings to cancel`);

    for (const booking of overdueBookings) {
      try {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            status: 'CANCELLED',
            cancelledAt: new Date()
          }
        });

        // Record cancellation transaction/log if needed
        await prisma.transaction.create({
          data: {
            userId: booking.customerId,
            bookingId: booking.id,
            type: 'REFUND',
            status: 'SUCCESS',
            amount: booking.amount,
            currency: 'NGN',
            squadEvent: 'booking.timeout_24h',
            metadata: { reason: 'artisan_ignored_24h' }
          }
        });

        // Note: In a real app, we would also decrease the artisan's credibility score here.
        console.log(`[Pending Job] Auto-cancelled booking ${booking.id} due to 24h inactivity`);
      } catch (error) {
        console.error(`[Pending Job] Failed to cancel booking ${booking.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('[Pending Job] Error checking overdue bookings:', error);
  }
}

module.exports = {
  runPendingTimeoutJob
};
