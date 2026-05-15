const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const quotationService = require('../src/modules/quotations/quotation.service');
const { prisma } = require('../src/config/database');
const { 
  createTestBooking, 
  createTestQuotation, 
  createTestSentQuotation,
  createTestAcceptedQuotation,
  cleanupTestData 
} = require('./test.utils');

describe('Quotation Service - Unit Tests', () => {
  let testData;

  before(async () => {
    // Basic setup shared across some tests
    testData = await createTestBooking();
  });

  after(async () => {
    await cleanupTestData({ 
      bookingId: testData.booking.id,
      serviceId: testData.serviceId,
      userId: testData.customerId
    });
  });

  describe('generateDraft', () => {
    it('should generate a quotation draft with status DRAFT', async () => {
      const { booking } = await createTestBooking();
      const customerDetails = { firstName: 'Test', lastName: 'User', city: 'Lagos' };
      const serviceDetails = { title: 'Service', description: 'Desc', priceFrom: 10000, priceTo: 20000 };

      const result = await quotationService.generateDraft(booking.id, customerDetails, serviceDetails);

      assert.strictEqual(result.status, 'DRAFT');
      assert.ok(result.draftMaterialsCost > 0);
      assert.ok(result.draftLabourCost > 0);

      // Check if booking status was updated
      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'QUOTE_REQUESTED');
    });

    it('should fail if booking does not exist', async () => {
      await assert.rejects(
        quotationService.generateDraft(
          'nonexistent_id',
          { city: 'Lagos' },
          { title: 'Svc', priceFrom: 1, priceTo: 2 }
        ),
        { statusCode: 404 }
      );
    });
  });

  describe('sendQuotation', () => {
    it('should change status to SENT and set final costs', async () => {
      const { booking } = await createTestBooking();
      const quotation = await createTestQuotation(booking.id);

      const updated = await quotationService.sendQuotation(
        quotation.id,
        25000,
        35000,
        'Final offer'
      );

      assert.strictEqual(updated.status, 'SENT');
      assert.strictEqual(Number(updated.finalMaterialsCost), 25000);
      assert.strictEqual(Number(updated.finalLabourCost), 35000);
      
      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'QUOTE_SENT');
    });
  });

  describe('acceptQuotation', () => {
    it('should change status to ACCEPTED and set escrow refs', async () => {
      const { booking } = await createTestBooking();
      const quotation = await createTestSentQuotation(booking.id);

      const updated = await quotationService.acceptQuotation(quotation.id);

      assert.strictEqual(updated.status, 'ACCEPTED');
      assert.ok(updated.squadMaterialsRef);
      assert.ok(updated.squadLabourRef);
      assert.ok(updated.materialsReleasedAt);

      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'ACCEPTED');
    });
  });

  describe('rejectQuotation', () => {
    it('should change status to REJECTED and cancel booking', async () => {
      const { booking } = await createTestBooking();
      const quotation = await createTestSentQuotation(booking.id);

      const updated = await quotationService.rejectQuotation(quotation.id, 'Too expensive');

      assert.strictEqual(updated.status, 'REJECTED');
      
      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'CANCELLED');
    });
  });

  describe('startNegotiation', () => {
    it('should add message and set status to NEGOTIATING', async () => {
      const { booking } = await createTestBooking();
      const quotation = await createTestSentQuotation(booking.id);

      const message = await quotationService.startNegotiation(
        quotation.id,
        'CUSTOMER',
        'Can we lower the price?'
      );

      assert.strictEqual(message.sender, 'CUSTOMER');
      assert.strictEqual(message.message, 'Can we lower the price?');

      const updatedQuotation = await prisma.quotation.findUnique({ where: { id: quotation.id } });
      assert.strictEqual(updatedQuotation.status, 'NEGOTIATING');
      
      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'NEGOTIATING');
    });
  });

  describe('releaseLaborEscrow', () => {
    it('should change status to COMPLETED and set release time', async () => {
      const { booking } = await createTestBooking();
      // Need provider record for totalEarnings increment test
      await prisma.provider.create({
        data: {
          userId: booking.providerId,
          tradeName: 'Test Trade'
        }
      });
      
      const quotation = await createTestAcceptedQuotation(booking.id);

      const updated = await quotationService.releaseLaborEscrow(quotation.id);

      assert.strictEqual(updated.status, 'COMPLETED');
      assert.ok(updated.labourReleasedAt);

      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'COMPLETED');
    });
  });
});
