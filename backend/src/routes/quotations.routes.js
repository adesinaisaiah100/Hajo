const express = require('express');
const quotationController = require('../modules/quotations/quotation.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All quotation routes require authentication
router.use(requireAuth);

/**
 * POST /api/quotations - Generate draft quotation
 */
router.post('/', quotationController.generateDraft);

/**
 * GET /api/quotations/:id - Get quotation with messages (polling endpoint)
 */
router.get('/:id', quotationController.getQuotation);

/**
 * PATCH /api/quotations/:id - Send quotation or add negotiation message
 */
router.patch('/:id', quotationController.updateQuotation);

/**
 * POST /api/quotations/:id/accept - Accept quotation and initiate split escrow
 */
router.post('/:id/accept', quotationController.acceptQuotation);

/**
 * POST /api/quotations/:id/reject - Reject quotation
 */
router.post('/:id/reject', quotationController.rejectQuotation);

/**
 * POST /api/quotations/:id/messages - Add negotiation message
 */
router.post('/:id/messages', quotationController.addMessage);

module.exports = router;
