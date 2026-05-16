const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('Clearing database...');

  await prisma.$transaction([
    prisma.negotiationMessage.deleteMany({}),
    prisma.quotation.deleteMany({}),
    prisma.review.deleteMany({}),
    prisma.booking.deleteMany({}),
    prisma.transaction.deleteMany({}),
    prisma.service.deleteMany({}),
    prisma.creditScore.deleteMany({}),
    prisma.scoreSnapshot.deleteMany({}),
    prisma.provider.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);

  console.log('Database cleared successfully.');
}

clearDatabase()
  .catch((error) => {
    console.error('Failed to clear database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });