const asyncHandler = require('../../utils/asyncHandler');
const { createReview, getProviderReviews } = require('./review.service');

async function handleCreateReview(req, res) {
  const { bookingId, revieweeId, providerId, rating, comment } = req.body;
  const reviewerId = req.user.id;

  const review = await createReview({
    bookingId,
    reviewerId,
    revieweeId,
    providerId,
    rating,
    comment,
    type: req.user.role === 'CUSTOMER' ? 'PROVIDER_REVIEW' : 'CUSTOMER_REVIEW'
  });

  res.status(201).json({ success: true, review });
}

async function handleGetProviderReviews(req, res) {
  const { providerId } = req.params;
  const { limit = 10, offset = 0 } = req.query;

  const reviews = await getProviderReviews(providerId, parseInt(limit), parseInt(offset));

  res.status(200).json({ success: true, reviews });
}

module.exports = {
  createReview: asyncHandler(handleCreateReview),
  getProviderReviews: asyncHandler(handleGetProviderReviews)
};
