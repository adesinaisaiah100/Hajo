const { prisma } = require('../../config/database');

// Create review for completed booking
async function createReview({ bookingId, reviewerId, revieweeId, providerId, rating, comment, type }) {
  // Validate rating
  if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.status !== 'COMPLETED') throw new Error('Can only review completed bookings');

  // Check if review already exists
  const existing = await prisma.review.findUnique({ where: { bookingId } });
  if (existing) throw new Error('Review already exists for this booking');

  const review = await prisma.review.create({
    data: {
      bookingId,
      reviewerId,
      revieweeId,
      providerId,
      rating,
      comment,
      type
    }
  });

  // Update provider average rating
  if (providerId) {
    const reviews = await prisma.review.findMany({ where: { providerId } });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await prisma.provider.update({
      where: { id: providerId },
      data: { averageRating: avgRating, completedJobs: { increment: 1 } }
    });
  }

  return review;
}

// Get reviews for provider
async function getProviderReviews(providerId, limit = 10, offset = 0) {
  return prisma.review.findMany({
    where: { providerId },
    take: limit,
    skip: offset,
    orderBy: { createdAt: 'desc' },
    include: { reviewer: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } }
  });
}

module.exports = {
  createReview,
  getProviderReviews
};
