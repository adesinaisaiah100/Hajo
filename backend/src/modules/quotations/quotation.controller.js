const quotationService = require('./quotation.service');
const {
  generateDraftSchema,
  sendQuotationSchema,
  acceptQuotationSchema,
  rejectQuotationSchema,
  negotiationMessageSchema,
} = require('./quotation.schemas');
const asyncHandler = require('../../utils/asyncHandler');
const { AppError } = require('../../middleware/error');

/**
 * POST /api/quotations - Generate draft quotation for booking
 */
const generateDraft = asyncHandler(async (req, res) => {
  const { bookingId } = generateDraftSchema.parse(req.body);

  // Get booking with service and customer details
  const booking = await require('../../config/database').booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      service: true,
      provider: true,
    },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  const quotation = await quotationService.generateDraft(
    bookingId,
    {
      firstName: booking.customer.firstName,
      lastName: booking.customer.lastName,
      city: booking.customer.city,
    },
    {
      title: booking.service.title,
      description: booking.service.description,
      priceFrom: booking.service.price,
      priceTo: booking.service.price,
    }
  );

  res.status(201).json({
    success: true,
    data: quotation,
  });
});

/**
 * GET /api/quotations/:id - Get quotation with messages (polling endpoint)
 */
const getQuotation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quotation = await quotationService.getQuotationWithMessages(id);

  res.status(200).json({
    success: true,
    data: quotation,
  });
});

/**
 * PATCH /api/quotations/:id - Send quotation or add negotiation message
 */
const updateQuotation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action, finalMaterialsCost, finalLabourCost, description, message, suggestedCost, senderRole } = req.body;

  if (action === 'send') {
    // Validate send action
    const { finalMaterialsCost: cost1, finalLabourCost: cost2, description: desc } =
      sendQuotationSchema.parse({
        finalMaterialsCost,
        finalLabourCost,
        description,
      });

    const quotation = await quotationService.sendQuotation(id, cost1, cost2, desc);

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } else if (action === 'negotiate') {
    // Validate negotiate action
    const { message: msg, suggestedCost: cost } =
      negotiationMessageSchema.parse({
        message,
        suggestedCost,
      });

    const msgRecord = await quotationService.startNegotiation(id, senderRole || 'CUSTOMER', msg, cost);

    res.status(201).json({
      success: true,
      data: msgRecord,
    });
  } else {
    throw new AppError('Invalid action. Must be "send" or "negotiate"', 400);
  }
});

/**
 * POST /api/quotations/:id/accept - Customer accepts quotation
 */
const acceptQuotation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const quotation = await quotationService.acceptQuotation(id);

  res.status(200).json({
    success: true,
    data: quotation,
  });
});

/**
 * POST /api/quotations/:id/reject - Customer rejects quotation
 */
const rejectQuotation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const quotation = await quotationService.rejectQuotation(id, reason);

  res.status(200).json({
    success: true,
    data: quotation,
  });
});

/**
 * POST /api/quotations/:id/messages - Add negotiation message
 */
const addMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, suggestedCost, senderRole } = negotiationMessageSchema.parse(req.body);

  const msgRecord = await quotationService.startNegotiation(id, senderRole || 'CUSTOMER', message, suggestedCost);

  res.status(201).json({
    success: true,
    data: msgRecord,
  });
});

module.exports = {
  generateDraft,
  getQuotation,
  updateQuotation,
  acceptQuotation,
  rejectQuotation,
  addMessage,
};
