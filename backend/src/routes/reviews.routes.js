const express = require('express');
const router = express.Router();
const { createReview, getProviderReviews } = require('../modules/reviews/review.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createReview);
router.get('/providers/:providerId', getProviderReviews);

module.exports = router;
