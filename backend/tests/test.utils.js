/**
 * Test Utilities for Quotation System Tests
 * 
 * Provides helper functions, mocks, and factories for testing
 * quotation workflow, split escrow, and webhook integration.
 */

const { prisma } = require('../src/config/database');

/**
 * Create a test booking with customer, provider, and service
 */
async function createTestBooking(overrides = {}) {
  const customerId = overrides.customerId || `test_cust_${Date.now()}`;
  const providerId = overrides.providerId || `test_prov_${Date.now()}`;
  const serviceId = overrides.serviceId || `test_svc_${Date.now()}`;

  // Create customer user if not provided
  if (!overrides.customerId) {
    await prisma.user.create({
      data: {
        id: customerId,
        phone: `+234${Math.random().toString().slice(2, 12)}`,
        firstName: 'Test',
        lastName: 'Customer',
        role: 'CUSTOMER',
        isVerified: true,
      },
    }).catch(() => {}); // Ignore if exists
  }

  // Create provider user if not provided
  if (!overrides.providerId) {
    await prisma.user.create({
      data: {
        id: providerId,
        phone: `+234${Math.random().toString().slice(2, 12)}`,
        firstName: 'Test',
        lastName: 'Artisan',
        role: 'PROVIDER',
        isVerified: true,
      },
    }).catch(() => {}); // Ignore if exists
  }

  // Create service if not provided
  if (!overrides.serviceId) {
    await prisma.service.create({
      data: {
        id: serviceId,
        providerId,
        title: 'Test Service',
        description: 'Test service description',
        category: 'plumbing',
        price: 50000,
      },
    }).catch(() => {}); // Ignore if exists
  }

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      customerId,
      providerId,
      serviceId,
      amount: overrides.amount || 50000,
      currency: 'NGN',
      status: 'PENDING',
    },
  });

  return { booking, customerId, providerId, serviceId };
}

/**
 * Create a test quotation in DRAFT status
 */
async function createTestQuotation(bookingId, overrides = {}) {
  const quotation = await prisma.quotation.create({
    data: {
      bookingId,
      draftMaterialsCost: overrides.draftMaterialsCost || 20000,
      draftLabourCost: overrides.draftLabourCost || 30000,
      draftDescription: overrides.draftDescription || 'Test quotation',
      status: 'DRAFT',
    },
  });

  return quotation;
}

/**
 * Create a test quotation in SENT status
 */
async function createTestSentQuotation(bookingId, overrides = {}) {
  const quotation = await prisma.quotation.create({
    data: {
      bookingId,
      draftMaterialsCost: overrides.draftMaterialsCost || 20000,
      draftLabourCost: overrides.draftLabourCost || 30000,
      draftDescription: overrides.draftDescription || 'Test quotation',
      finalMaterialsCost: overrides.finalMaterialsCost || 20000,
      finalLabourCost: overrides.finalLabourCost || 30000,
      finalDescription: overrides.finalDescription || 'Test quotation final',
      status: 'SENT',
      sentAt: new Date(),
    },
  });

  return quotation;
}

/**
 * Create a test quotation in ACCEPTED status
 */
async function createTestAcceptedQuotation(bookingId, overrides = {}) {
  const quotation = await prisma.quotation.create({
    data: {
      bookingId,
      draftMaterialsCost: overrides.draftMaterialsCost || 20000,
      draftLabourCost: overrides.draftLabourCost || 30000,
      draftDescription: overrides.draftDescription || 'Test quotation',
      finalMaterialsCost: overrides.finalMaterialsCost || 20000,
      finalLabourCost: overrides.finalLabourCost || 30000,
      finalDescription: overrides.finalDescription || 'Test quotation final',
      status: 'ACCEPTED',
      sentAt: new Date(Date.now() - 1000),
      acceptedAt: new Date(),
      squadMaterialsRef: `test_mat_${Date.now()}`,
      squadLabourRef: `test_lab_${Date.now()}`,
      materialsReleasedAt: new Date(), // Materials released immediately
    },
  });

  return quotation;
}

/**
 * Create a test negotiation message
 */
async function createTestNegotiationMessage(quotationId, overrides = {}) {
  const message = await prisma.negotiationMessage.create({
    data: {
      quotationId,
      sender: overrides.sender || 'CUSTOMER',
      message: overrides.message || 'Test negotiation message',
      suggestedCost: overrides.suggestedCost || null,
    },
  });

  return message;
}

/**
 * Mock Gemini response
 */
function mockGeminiResponse(overrides = {}) {
  return {
    materialsCost: overrides.materialsCost || 20000,
    labourCost: overrides.labourCost || 30000,
    description: overrides.description || 'Mock quotation from Gemini',
  };
}

/**
 * Mock Squad webhook event
 */
function mockSquadWebhookEvent(overrides = {}) {
  return {
    event_type: overrides.event_type || 'transfer.success',
    data: {
      transaction_ref: overrides.transaction_ref || `mock_ref_${Date.now()}`,
      status: overrides.status || 'success',
      amount: overrides.amount || 50000,
      currency: overrides.currency || 'NGN',
      customer_id: overrides.customer_id || 'test_customer',
    },
  };
}

/**
 * Clean up test data
 */
async function cleanupTestData(identifiers = {}) {
  try {
    // Delete in reverse dependency order
    if (identifiers.quotationId) {
      await prisma.negotiationMessage.deleteMany({
        where: { quotationId: identifiers.quotationId },
      });
      await prisma.quotation.delete({
        where: { id: identifiers.quotationId },
      });
    }

    if (identifiers.bookingId) {
      await prisma.booking.delete({
        where: { id: identifiers.bookingId },
      });
    }

    if (identifiers.serviceId) {
      await prisma.service.delete({
        where: { id: identifiers.serviceId },
      });
    }

    if (identifiers.userId) {
      await prisma.user.delete({
        where: { id: identifiers.userId },
      });
    }
  } catch (error) {
    console.warn('[Test Cleanup] Error during cleanup:', error.message);
  }
}

/**
 * Calculate time difference in hours
 */
function getHoursDifference(from, to = new Date()) {
  return (to.getTime() - new Date(from).getTime()) / (1000 * 60 * 60);
}

/**
 * Simulate time passage for timeout tests
 * (In real tests, use a library like `jest.useFakeTimers()` or similar)
 */
function createOverdueDate(hoursAgo) {
  const now = new Date();
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

module.exports = {
  createTestBooking,
  createTestQuotation,
  createTestSentQuotation,
  createTestAcceptedQuotation,
  createTestNegotiationMessage,
  mockGeminiResponse,
  mockSquadWebhookEvent,
  cleanupTestData,
  getHoursDifference,
  createOverdueDate,
};
