const test = require('node:test');
const assert = require('node:assert/strict');

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/hajo_test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-access-secret-1234567890';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-1234567890';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const { createAuthService } = require('../src/modules/auth/auth.service');
const { otpStore } = require('../src/utils/otpStore');

function createMockPrisma() {
  const users = new Map();
  const providers = new Map();

  return {
    user: {
      async findUnique({ where }) {
        return users.get(where.phone) || users.get(where.id) || null;
      },
      async create({ data }) {
        const user = {
          id: `user_${users.size + 1}`,
          tokenVersion: 0,
          isVerified: false,
          provider: null,
          ...data
        };
        users.set(user.phone, user);
        users.set(user.id, user);
        return user;
      },
      async update({ where, data }) {
        const existing = users.get(where.phone) || users.get(where.id);
        const next = {
          ...existing,
          ...data,
          provider: existing.provider || null
        };
        if (data.tokenVersion?.increment) {
          next.tokenVersion = (existing.tokenVersion || 0) + data.tokenVersion.increment;
        }
        users.set(next.phone, next);
        users.set(next.id, next);
        return next;
      }
    },
    provider: {
      async upsert({ where, create, update }) {
        const current = providers.get(where.userId);
        const provider = current
          ? { ...current, ...update }
          : {
              id: `provider_${providers.size + 1}`,
              ...create
            };
        providers.set(where.userId, provider);
        const user = users.get(where.userId);
        if (user) {
          user.provider = provider;
        }
        return provider;
      }
    }
  };
}

test('register sends OTP and creates a provider profile', async () => {
  const prisma = createMockPrisma();
  const authService = createAuthService({ prisma });

  const result = await authService.register({
    firstName: 'Amina',
    lastName: 'Bello',
    phone: '+2348012345678',
    role: 'PROVIDER',
    tradeName: 'Amina Barber Studio',
    skills: ['barbering', 'haircuts'],
    yearsExperience: 5
  });

  assert.equal(result.otpDelivered, true);
  assert.equal(result.user.role, 'PROVIDER');
  assert.equal(result.user.provider.tradeName, 'Amina Barber Studio');
  assert.equal(typeof result.debugOtp, 'string');
  assert.equal(otpStore.has('+2348012345678'), true);
});

test('verifyOtp issues tokens and assigns a virtual account', async () => {
  const prisma = createMockPrisma();
  const authService = createAuthService({ prisma });

  const registration = await authService.register({
    firstName: 'Musa',
    lastName: 'Ade',
    phone: '+2348098765432',
    role: 'CUSTOMER'
  });

  const verifyResult = await authService.verifyOtp({
    phone: '+2348098765432',
    otp: registration.debugOtp
  });

  assert.equal(typeof verifyResult.accessToken, 'string');
  assert.equal(typeof verifyResult.refreshToken, 'string');
  assert.equal(verifyResult.user.isVerified, true);
  assert.equal(typeof verifyResult.user.squadAccountNo, 'string');
});