const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const bookingService = require('../src/modules/booking/booking.service');
const quotationService = require('../src/modules/quotations/quotation.service');
const { prisma } = require('../src/config/database');
const { 
  createTestBooking, 
  cleanupTestData 
} = require('./test.utils');

describe('Integration: Quotation Workflow', () => {
  let testData;

  before(async () => {
    // Setup initial data if needed
  });

  after(async () => {
    // Cleanup if needed
  });

  describe('Booking Creation → Quotation Generation', () => {
    it('should auto-generate quotation when booking is created', async () => {
      // 1. Create a service and customer for real booking creation
      const customer = await prisma.user.create({
        data: {
          phone: `+234${Math.random().toString().slice(2, 12)}`,
          firstName: 'Samuel',
          lastName: 'Ade',
          role: 'CUSTOMER',
        },
      });

      const providerUser = await prisma.user.create({
        data: {
          phone: `+234${Math.random().toString().slice(2, 12)}`,
          firstName: 'Amina',
          lastName: 'Yusuf',
          role: 'PROVIDER',
        },
      });

      const provider = await prisma.provider.create({
        data: {
          userId: providerUser.id,
          tradeName: 'Amina Home Electricals',
        },
      });

      const service = await prisma.service.create({
        data: {
          providerId: provider.id,
          title: 'AC Maintenance',
          category: 'Electrical',
          price: 15000,
        },
      });

      // 2. Create booking via bookingService (this should trigger quotation generation)
      const { booking } = await bookingService.createBooking({
        customerId: customer.id,
        providerId: providerUser.id,
        serviceId: service.id,
        amount: 15000,
        scheduledAt: new Date(),
      });

      // 3. Verify booking status is QUOTE_REQUESTED
      assert.strictEqual(booking.status, 'QUOTE_REQUESTED');

      // 4. Verify quotation was created
      const quotation = await prisma.quotation.findUnique({
        where: { bookingId: booking.id },
      });

      assert.ok(quotation, 'Quotation should exist');
      assert.strictEqual(quotation.status, 'DRAFT');
      assert.ok(Number(quotation.draftMaterialsCost) > 0);
      assert.ok(Number(quotation.draftLabourCost) > 0);

      // Cleanup
      await cleanupTestData({ bookingId: booking.id, quotationId: quotation.id, serviceId: service.id });
      await prisma.provider.delete({ where: { id: provider.id } });
      await prisma.user.deleteMany({ where: { id: { in: [customer.id, providerUser.id] } } });
    });
  });

  describe('Full Acceptance Flow', () => {
    it('should handle full flow: draft -> send -> accept', async () => {
      const { booking, customerId, providerId, serviceId } = await createTestBooking();
      
      // 1. Generate draft (done manually here for control)
      const draft = await quotationService.generateDraft(booking.id, { city: 'Lagos' }, { title: 'Test', priceFrom: 10000, priceTo: 20000 });
      
      // 2. Artisan sends quotation
      const sent = await quotationService.sendQuotation(draft.id, 5000, 10000, 'Final costs');
      assert.strictEqual(sent.status, 'SENT');
      
      // 3. Customer accepts quotation
      const accepted = await quotationService.acceptQuotation(draft.id);
      assert.strictEqual(accepted.status, 'ACCEPTED');
      assert.ok(accepted.materialsReleasedAt);
      
      // 4. Verify booking is ACCEPTED
      const updatedBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      assert.strictEqual(updatedBooking.status, 'ACCEPTED');

      // 5. Verify transaction was created for materials release
      const transaction = await prisma.transaction.findFirst({
        where: { bookingId: booking.id, type: 'ESCROW_RELEASE' }
      });
      assert.ok(transaction, 'Transaction should exist');
      assert.strictEqual(Number(transaction.amount), 5000);

      // Cleanup
      await cleanupTestData({ bookingId: booking.id, quotationId: draft.id, serviceId, userId: customerId });
      await prisma.user.delete({ where: { id: providerId } }).catch(() => {});
    });
  });
});
