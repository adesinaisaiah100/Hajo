const prisma = require('../../config/database');
const { geminiClient } = require('../../integrations/gemini/gemini.client');
const { generateDeterministicQuotation } = require('../../utils/quotation.utils');
const { AppError } = require('../../utils/asyncHandler');

/**
 * Generate AI-drafted quotation for a booking
 */
async function generateDraft(bookingId, customerDetails, serviceDetails) {
  try {
    // Check if quotation already exists for this booking
    const existing = await prisma.quotation.findUnique({ where: { bookingId } });
    if (existing) {
      throw new AppError('Quotation already exists for this booking', 400);
    }

    // Fetch booking to ensure it exists
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    // Generate costs via Gemini or fallback to deterministic
    let draftCosts;
    try {
      draftCosts = await geminiClient.generateQuotation({
        serviceType: serviceDetails.title,
        description: serviceDetails.description,
        location: customerDetails.city,
        budgetRange: `NGN ${serviceDetails.priceFrom} - ${serviceDetails.priceTo}`,
      });
    } catch (error) {
      console.warn('[QuotationService] Gemini failed, using deterministic fallback:', error.message);
      draftCosts = generateDeterministicQuotation(serviceDetails);
    }

    // Create quotation with draft costs
    const quotation = await prisma.quotation.create({
      data: {
        bookingId,
        draftMaterialsCost: parseFloat(draftCosts.materialsCost),
        draftLabourCost: parseFloat(draftCosts.labourCost),
        draftDescription: draftCosts.description || serviceDetails.description || 'Service quotation',
        status: 'DRAFT',
      },
    });

    // Update booking status to QUOTE_REQUESTED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'QUOTE_REQUESTED' },
    });

    return quotation;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to generate quotation: ${error.message}`, 500);
  }
}

/**
 * Send quotation to customer (artisan finalized draft)
 */
async function sendQuotation(quotationId, finalMaterialsCost, finalLabourCost, description) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: true },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.status !== 'DRAFT') {
      throw new AppError('Only DRAFT quotations can be sent', 400);
    }

    if (!finalMaterialsCost || !finalLabourCost || finalMaterialsCost <= 0 || finalLabourCost <= 0) {
      throw new AppError('Materials and labour costs must be positive numbers', 400);
    }

    // Update quotation status and costs
    const updated = await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'SENT',
        finalMaterialsCost,
        finalLabourCost,
        finalDescription: description || quotation.draftDescription,
        sentAt: new Date(),
      },
      include: { messages: true },
    });

    // Update booking status to QUOTE_SENT
    await prisma.booking.update({
      where: { id: quotation.bookingId },
      data: { status: 'QUOTE_SENT' },
    });

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to send quotation: ${error.message}`, 500);
  }
}

/**
 * Customer accepts quotation and initiates split escrow
 */
async function acceptQuotation(quotationId) {
  try {
    const { initiateSplitEscrow, releaseMaterialsEscrow } = require('../../integrations/squad/squad.splitEscrow');

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: { include: { customer: true, provider: true, service: true } } },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.status !== 'SENT' && quotation.status !== 'NEGOTIATING') {
      throw new AppError('Only SENT or NEGOTIATING quotations can be accepted', 400);
    }

    // Initiate split escrow (In production, this might trigger a payment UI)
    const splitEscrow = await initiateSplitEscrow(
      quotation.booking,
      parseFloat(quotation.finalMaterialsCost),
      parseFloat(quotation.finalLabourCost)
    );

    // Release materials portion immediately to artisan
    const artisanSquadAccountRef = quotation.booking.provider.squadAccountNo || '0123456789';
    await releaseMaterialsEscrow(
      splitEscrow.materialsRef,
      artisanSquadAccountRef,
      parseFloat(quotation.finalMaterialsCost)
    );

    // Update quotation with split escrow refs and release times
    const updated = await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        squadMaterialsRef: splitEscrow.materialsRef,
        squadLabourRef: splitEscrow.labourRef,
        materialsReleasedAt: new Date(), // Released immediately
      },
      include: { messages: true },
    });

    // Update booking status to ACCEPTED
    await prisma.booking.update({
      where: { id: quotation.bookingId },
      data: { status: 'ACCEPTED' },
    });

    // Record materials release transaction
    await prisma.transaction.create({
      data: {
        userId: quotation.booking.providerId,
        bookingId: quotation.bookingId,
        type: 'ESCROW_RELEASE',
        status: 'SUCCESS',
        amount: quotation.finalMaterialsCost,
        currency: 'NGN',
        squadRef: splitEscrow.materialsRef,
        squadEvent: 'quotation.materials_released',
        metadata: { quotationId, type: 'materials' }
      }
    });

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to accept quotation: ${error.message}`, 500);
  }
}

/**
 * Customer rejects quotation
 */
async function rejectQuotation(quotationId, reason = '') {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: true },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.status !== 'SENT' && quotation.status !== 'NEGOTIATING') {
      throw new AppError('Only SENT or NEGOTIATING quotations can be rejected', 400);
    }

    // Update quotation status
    const updated = await prisma.quotation.update({
      where: { id: quotationId },
      data: { status: 'REJECTED' },
      include: { messages: true },
    });

    // Update booking status to CANCELLED
    await prisma.booking.update({
      where: { id: quotation.bookingId },
      data: { status: 'CANCELLED' },
    });

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to reject quotation: ${error.message}`, 500);
  }
}

/**
 * Add negotiation message and enter NEGOTIATING status
 */
async function startNegotiation(quotationId, senderRole, message, suggestedCost = null) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: true },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.status !== 'SENT' && quotation.status !== 'NEGOTIATING') {
      throw new AppError('Only SENT or NEGOTIATING quotations can receive messages', 400);
    }

    if (!message || message.trim().length === 0) {
      throw new AppError('Message cannot be empty', 400);
    }

    // Create negotiation message
    const msgRecord = await prisma.negotiationMessage.create({
      data: {
        quotationId,
        sender: senderRole.toUpperCase(),
        message,
        suggestedCost: suggestedCost ? parseFloat(suggestedCost) : null,
      },
    });

    // Update quotation status if not already NEGOTIATING
    if (quotation.status === 'SENT') {
      await prisma.quotation.update({
        where: { id: quotationId },
        data: { status: 'NEGOTIATING' },
      });

      // Update booking status to NEGOTIATING
      await prisma.booking.update({
        where: { id: quotation.bookingId },
        data: { status: 'NEGOTIATING' },
      });
    }

    return msgRecord;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to add negotiation message: ${error.message}`, 500);
  }
}

/**
 * Get quotation with full message thread (for polling)
 */
async function getQuotationWithMessages(quotationId) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        booking: {
          include: {
            customer: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
            provider: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, squadAccountNo: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    return quotation;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch quotation: ${error.message}`, 500);
  }
}

/**
 * Mark labour escrow as released (called on booking completion)
 */
async function releaseLaborEscrow(quotationId) {
  try {
    const { releaseLaborEscrow: squadRelease } = require('../../integrations/squad/squad.splitEscrow');

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: { include: { provider: true } } },
    });

    if (!quotation) {
      throw new AppError('Quotation not found', 404);
    }

    if (quotation.status !== 'ACCEPTED') {
      throw new AppError('Only ACCEPTED quotations can have labour released', 400);
    }

    // Call Squad release
    const artisanSquadAccountRef = quotation.booking.provider.squadAccountNo || '0123456789';
    await squadRelease(
      quotation.squadLabourRef,
      artisanSquadAccountRef,
      parseFloat(quotation.finalLabourCost)
    );

    // Update quotation to mark labour as released
    const updated = await prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'COMPLETED',
        labourReleasedAt: new Date(),
      },
    });

    // Record labour release transaction
    await prisma.transaction.create({
      data: {
        userId: quotation.booking.providerId,
        bookingId: quotation.bookingId,
        type: 'ESCROW_RELEASE',
        status: 'SUCCESS',
        amount: quotation.finalLabourCost,
        currency: 'NGN',
        squadRef: quotation.squadLabourRef,
        squadEvent: 'quotation.labour_released',
        metadata: { quotationId, type: 'labour' }
      }
    });

    // Update booking to COMPLETED if not already
    if (quotation.booking.status !== 'COMPLETED') {
      await prisma.booking.update({
        where: { id: quotation.bookingId },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });
    }

    // Update provider earnings
    await prisma.provider.update({
      where: { userId: quotation.booking.providerId },
      data: { totalEarnings: { increment: Number(quotation.finalMaterialsCost || 0) + Number(quotation.finalLabourCost || 0) } }
    });

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to release labour escrow: ${error.message}`, 500);
  }
}

/**
 * Force release labour escrow (48-hour timeout)
 */
async function forceReleaseLaborEscrow(quotationId) {
  try {
    const { forceReleaseLaborEscrow: squadForceRelease } = require('../../integrations/squad/squad.splitEscrow');

    const quotation = await prisma.quotation.findUnique({
      where: { id: quotationId },
      include: { booking: { include: { provider: true } } },
    });

    if (!quotation) return;

    const artisanSquadAccountRef = quotation.booking.provider.squadAccountNo || '0123456789';
    await squadForceRelease(
      quotation.squadLabourRef,
      artisanSquadAccountRef,
      parseFloat(quotation.finalLabourCost)
    );

    const updated = await releaseLaborEscrow(quotationId);
    console.log(`[Quotation] Force-released labour escrow for quotation ${quotationId}`);
    return updated;
  } catch (error) {
    console.error(`[Quotation] Failed to force-release labour escrow: ${error.message}`);
    throw error;
  }
}

module.exports = {
  generateDraft,
  sendQuotation,
  acceptQuotation,
  rejectQuotation,
  startNegotiation,
  getQuotationWithMessages,
  releaseLaborEscrow,
  forceReleaseLaborEscrow,
};
