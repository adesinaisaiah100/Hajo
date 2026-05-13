const { PrismaClient } = require('@prisma/client');

let prismaClient;

function getPrismaClient() {
  if (!prismaClient) {
    prismaClient = new PrismaClient();
  }

  return prismaClient;
}

async function connectDatabase() {
  const client = getPrismaClient();
  await client.$connect();
  return client;
}

async function disconnectDatabase() {
  if (prismaClient) {
    await prismaClient.$disconnect();
  }
}

module.exports = {
  prisma: getPrismaClient(),
  getPrismaClient,
  connectDatabase,
  disconnectDatabase
};