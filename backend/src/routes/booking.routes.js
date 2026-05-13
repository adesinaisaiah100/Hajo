const express = require('express');
const router = express.Router();
const { createBooking, acceptBooking, completeBooking, cancelBooking } = require('../modules/booking/booking.controller');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, createBooking);
router.put('/:bookingId/accept', requireAuth, acceptBooking);
router.put('/:bookingId/complete', requireAuth, completeBooking);
router.put('/:bookingId/cancel', requireAuth, cancelBooking);

module.exports = router;
