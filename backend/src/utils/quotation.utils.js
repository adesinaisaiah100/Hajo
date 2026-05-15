/**
 * Generate deterministic quotation when Gemini is unavailable
 * Used as fallback for local development and testing
 */
function generateDeterministicQuotation(serviceDetails) {
  // Use service price as baseline for cost estimation
  const basePrice = parseFloat(serviceDetails.price) || 500;

  // Estimate: materials 40%, labour 60%
  const materialsCost = Math.round(basePrice * 0.4);
  const labourCost = Math.round(basePrice * 0.6);

  return {
    materialsCost,
    labourCost,
    description: `${serviceDetails.title || 'Service'} - Materials and labour costs estimated based on service pricing.`,
  };
}

/**
 * Format quotation cost for display
 */
function formatQuotationCost(quotation) {
  const isSent = quotation.status === 'SENT' || quotation.status === 'ACCEPTED';

  const materials = isSent ? quotation.finalMaterialsCost : quotation.draftMaterialsCost;
  const labour = isSent ? quotation.finalLabourCost : quotation.draftLabourCost;

  return {
    materials: parseFloat(materials),
    labour: parseFloat(labour),
    total: parseFloat(materials) + parseFloat(labour),
    isDraft: !isSent,
  };
}

/**
 * Calculate if quotation has timed out (48 hours)
 */
function hasQuotationTimedOut(acceptedAt) {
  if (!acceptedAt) return false;

  const TIMEOUT_MS = 48 * 60 * 60 * 1000; // 48 hours
  const now = Date.now();
  const acceptedTime = new Date(acceptedAt).getTime();

  return now - acceptedTime > TIMEOUT_MS;
}

module.exports = {
  generateDeterministicQuotation,
  formatQuotationCost,
  hasQuotationTimedOut,
};
