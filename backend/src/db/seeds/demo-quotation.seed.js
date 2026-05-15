const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting demo seed...');

  // 1. Create a customer
  const customer = await prisma.user.upsert({
    where: { phone: '+2348000000001' },
    update: {},
    create: {
      phone: '+2348000000001',
      firstName: 'Samuel',
      lastName: 'Ade',
      role: 'CUSTOMER',
      isVerified: true,
      city: 'Lagos',
      state: 'Lagos',
    },
  });

  // 2. Create a provider
  const providerUser = await prisma.user.upsert({
    where: { phone: '+2348000000002' },
    update: {},
    create: {
      phone: '+2348000000002',
      firstName: 'Amina',
      lastName: 'Yusuf',
      role: 'PROVIDER',
      isVerified: true,
      city: 'Lagos',
      state: 'Lagos',
    },
  });

  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: {},
    create: {
      userId: providerUser.id,
      tradeName: 'Amina Home Electricals',
      bio: 'Residential electrician focused on repairs and rewiring.',
      yearsExperience: 5,
      priceFrom: 5000,
      priceTo: 50000,
    },
  });

  // 3. Create a service
  const service = await prisma.service.create({
    data: {
      providerId: provider.id,
      title: 'AC Maintenance & Repair',
      description: 'Full AC servicing including gas refill and filter cleaning.',
      category: 'Electrical',
      price: 15000,
    },
  });

  // 4. Create a booking that's already in NEGOTIATING state
  const booking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      providerId: providerUser.id,
      serviceId: service.id,
      amount: 15000,
      status: 'NEGOTIATING',
      notes: 'My AC is making a weird noise.',
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
    },
  });

  // 5. Create a quotation for that booking
  const quotation = await prisma.quotation.create({
    data: {
      bookingId: booking.id,
      draftMaterialsCost: 5000,
      draftLabourCost: 10000,
      draftDescription: 'Materials: Gas refill (3000), Filters (2000). Labour: 10000.',
      finalMaterialsCost: 6000,
      finalLabourCost: 10000,
      finalDescription: 'Final costs including extra sealant.',
      status: 'NEGOTIATING',
      sentAt: new Date(),
    },
  });

  // 6. Add some negotiation messages
  await prisma.negotiationMessage.createMany({
    data: [
      {
        quotationId: quotation.id,
        sender: 'CUSTOMER',
        message: 'Could you do it for 14,000 total?',
        suggestedCost: 14000,
      },
      {
        quotationId: quotation.id,
        sender: 'ARTISAN',
        message: 'I can do 15,000 including the new sealant which is better quality.',
        suggestedCost: 15000,
      },
    ],
  });

  console.log('Demo seed completed successfully!');
  console.log({
    customer: customer.id,
    provider: providerUser.id,
    booking: booking.id,
    quotation: quotation.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
