const { z } = require('zod');

const generateDraftSchema = z.object({
  bookingId: z.string().cuid('Invalid booking ID'),
});

const sendQuotationSchema = z.object({
  finalMaterialsCost: z.number().positive('Materials cost must be positive'),
  finalLabourCost: z.number().positive('Labour cost must be positive'),
  description: z.string().optional(),
});

const acceptQuotationSchema = z.object({
  quotationId: z.string().cuid('Invalid quotation ID'),
});

const rejectQuotationSchema = z.object({
  quotationId: z.string().cuid('Invalid quotation ID'),
  reason: z.string().optional(),
});

const negotiationMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  suggestedCost: z.number().positive('Suggested cost must be positive').optional().nullable(),
});

const updateQuotationSchema = z.object({
  quotationId: z.string().cuid('Invalid quotation ID'),
  finalMaterialsCost: z.number().positive('Materials cost must be positive').optional(),
  finalLabourCost: z.number().positive('Labour cost must be positive').optional(),
  description: z.string().optional(),
});

module.exports = {
  generateDraftSchema,
  sendQuotationSchema,
  acceptQuotationSchema,
  rejectQuotationSchema,
  negotiationMessageSchema,
  updateQuotationSchema,
};
