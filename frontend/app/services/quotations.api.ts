import { api } from './api';

/**
 * Generate AI-drafted quotation for a booking
 */
export const generateQuotation = (bookingId: string) =>
  api.post('/quotations', { bookingId }).then(r => r.data.data);

/**
 * Get quotation with messages (polling endpoint)
 */
export const getQuotation = (quotationId: string) =>
  api.get(`/quotations/${quotationId}`).then(r => r.data.data);

/**
 * Send quotation to customer
 */
export const sendQuotation = (
  quotationId: string,
  finalMaterialsCost: number,
  finalLabourCost: number,
  description?: string
) =>
  api
    .patch(`/quotations/${quotationId}`, {
      action: 'send',
      finalMaterialsCost,
      finalLabourCost,
      description,
    })
    .then(r => r.data.data);

/**
 * Customer accepts quotation
 */
export const acceptQuotation = (quotationId: string) =>
  api.post(`/quotations/${quotationId}/accept`).then(r => r.data.data);

/**
 * Customer rejects quotation
 */
export const rejectQuotation = (quotationId: string, reason?: string) =>
  api.post(`/quotations/${quotationId}/reject`, { reason }).then(r => r.data.data);

/**
 * Add negotiation message
 */
export const addNegotiationMessage = (
  quotationId: string,
  message: string,
  suggestedCost?: number,
  senderRole?: string
) =>
  api
    .post(`/quotations/${quotationId}/messages`, {
      message,
      suggestedCost,
      senderRole,
    })
    .then(r => r.data.data);

/**
 * Shorthand for negotiation (sent via PATCH)
 */
export const negotiateQuotation = (
  quotationId: string,
  message: string,
  suggestedCost?: number,
  senderRole?: string
) =>
  api
    .patch(`/quotations/${quotationId}`, {
      action: 'negotiate',
      message,
      suggestedCost,
      senderRole,
    })
    .then(r => r.data.data);
