const asyncHandler = require('../../utils/asyncHandler');
const { createBooking, acceptBooking, completeBooking, cancelBooking, findBookingById } = require('./booking.service');

async function handleCreateBooking(req, res) {
  const { providerId, serviceId, amount, currency, scheduledAt, notes } = req.body;
  const customerId = req.user.id;

  const result = await createBooking({ customerId, providerId, serviceId, amount, currency, scheduledAt, notes });

  res.status(201).json({ success: true, booking: result.booking, checkout: result.checkout });
}

async function handleAcceptBooking(req, res) {
  const { bookingId } = req.params;
  const providerId = req.user.id;

  const booking = await acceptBooking(bookingId, providerId);

  res.status(200).json({ success: true, booking });
}

async function handleCompleteBooking(req, res) {
  const { bookingId } = req.params;
  const customerId = req.user.id;

  const booking = await completeBooking(bookingId, customerId);

  res.status(200).json({ success: true, booking });
}

async function handleCancelBooking(req, res) {
  const { bookingId } = req.params;
  const { reason } = req.body;

  const booking = await cancelBooking(bookingId, reason);

  res.status(200).json({ success: true, booking });
}

module.exports = {
  createBooking: asyncHandler(handleCreateBooking),
  acceptBooking: asyncHandler(handleAcceptBooking),
  completeBooking: asyncHandler(handleCompleteBooking),
  cancelBooking: asyncHandler(handleCancelBooking)
};
