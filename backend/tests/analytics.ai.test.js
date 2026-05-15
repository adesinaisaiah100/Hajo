const test = require('node:test');
const assert = require('node:assert/strict');

const { createTransactionService } = require('../src/modules/transactions/transaction.service');
const { createInsightsService } = require('../src/modules/ai/insights.service');

function createMockPrisma() {
  return {
    transaction: {
      async findMany({ where }) {
        if (where.userId === 'provider-1') {
          return [
            { id: 'tx-2', amount: '2500', status: 'SUCCESS', type: 'WALLET_CREDIT', createdAt: new Date('2026-05-01T10:00:00Z') },
            { id: 'tx-1', amount: '1500', status: 'SUCCESS', type: 'ESCROW_RELEASE', createdAt: new Date('2026-04-01T10:00:00Z') }
          ];
        }

        return [];
      }
    },
    $queryRaw: async (queryParts, ...values) => {
      const text = Array.isArray(queryParts) ? queryParts.join('') : String(queryParts);
      if (text.includes('date_trunc')) {
        return [
          { month: new Date('2026-04-01T00:00:00Z'), total: '1500.00' },
          { month: new Date('2026-05-01T00:00:00Z'), total: '2500.00' }
        ];
      }

      if (text.includes('serviceId')) {
        return [
          { serviceId: 'svc-1', count: 3 },
          { serviceId: 'svc-2', count: 1 }
        ];
      }

      return values;
    },
    provider: {
      async findUnique() {
        return {
          id: 'provider-row-1',
          userId: 'provider-1',
          tradeName: 'Amina Studio',
          completedJobs: 12,
          totalEarnings: '42000.00',
          averageRating: 4.6,
          user: { firstName: 'Amina', lastName: 'Bello' }
        };
      }
    },
    booking: {
      async findMany() {
        return [
          { id: 'bk-1', status: 'COMPLETED', createdAt: new Date('2026-05-02T10:00:00Z') },
          { id: 'bk-2', status: 'PENDING', createdAt: new Date('2026-05-03T10:00:00Z') }
        ];
      }
    },
    review: {
      async aggregate() {
        return {
          _avg: { rating: 4.7 },
          _count: { rating: 8 }
        };
      }
    }
  };
}

function createMockRedis() {
  const store = new Map();

  return {
    async get(key) {
      return store.get(key) || null;
    },
    async set(key, value) {
      store.set(key, value);
      return 'OK';
    }
  };
}

test('provider analytics returns monthly summaries and top services', async () => {
  const prisma = createMockPrisma();
  const transactionService = createTransactionService({ prisma });

  const analytics = await transactionService.getProviderAnalytics('provider-1');

  assert.equal(analytics.summary.totalEarnings, 4000);
  assert.equal(analytics.monthlyEarnings.length, 2);
  assert.equal(analytics.topServices[0].serviceId, 'svc-1');
  assert.equal(analytics.recentTransactions.length, 2);
});

test('cached insights are reused on repeated calls', async () => {
  const prisma = createMockPrisma();
  const redisClient = createMockRedis();
  let aiCalls = 0;
  const aiClient = {
    async generateInsights(prompt) {
      aiCalls += 1;
      assert.match(prompt, /SkillBridge provider insights engine/);
      return {
        summary: 'Generated summary',
        trends: [{ label: 'Top service', value: 'svc-1' }],
        recommendations: ['Keep going']
      };
    }
  };

  const insightsService = createInsightsService({
    prisma,
    redisClient,
    aiClient,
    transactionService: createTransactionService({ prisma }),
    cacheTtlSeconds: 60,
    refreshCooldownSeconds: 10
  });

  const first = await insightsService.getProviderInsights('provider-1');
  const second = await insightsService.getProviderInsights('provider-1');

  assert.equal(aiCalls, 1);
  assert.equal(first.summary, 'Generated summary');
  assert.equal(second.summary, 'Generated summary');
  assert.equal(second.providerId, 'provider-1');
});
