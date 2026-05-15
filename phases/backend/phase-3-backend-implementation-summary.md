# Backend Phase 3 - Integration & Analytics Implementation Summary

**Phase reference:** Backend Phase 3
**Scope:** Analytics endpoints, AI insight shaping, score narratives, caching, score snapshots, and scheduled score refresh.

## Goal
Deliver the backend services needed for provider dashboards and AI narratives: analytics summaries, cached insight generation with Gemini, score breakdowns, and a nightly refresh job that persists score history.

## Frontend

No new frontend files were added for this backend phase. The implementation is consumed by the existing dashboard, booking, and wallet screens through these contracts:

- `GET /api/analytics/dashboard` for provider dashboard summaries.
- `GET /api/ai/insights` for provider insight summaries.
- `GET /api/ai/score` for provider score breakdowns.
- `GET /api/transactions/summary` for wallet and activity views.

These endpoints are designed to keep the provider experience responsive even when AI generation is cold, because the backend can fall back to deterministic summaries and cached responses.

## Backend

### What was implemented

- Added a Redis helper in `backend/src/config/redis.js` so cached AI responses can use Redis when available and fall back cleanly when it is not.
- Extended `backend/src/config/env.js` to support `REDIS_URL`, `REDIS_URI`, `AI_PROVIDER`, `GOOGLE_API_KEY`, `GEMINI_MODEL`, and `GEMINI_API_BASE`.
- Added a Gemini client wrapper in `backend/src/integrations/gemini/gemini.client.js` to keep the AI provider logic isolated from business services.
- Added `backend/src/routes/analytics.routes.js` and `backend/src/routes/ai.routes.js` to expose the new analytics and AI endpoints.
- Added `backend/src/modules/analytics/analytics.controller.js` and `backend/src/modules/ai/ai.controller.js` to connect routes to services.
- Reworked `backend/src/modules/transactions/transaction.service.js` so it can return user summaries, monthly earnings, top services, and provider analytics.
- Added `backend/src/modules/ai/insights.service.js` for prompt shaping, Gemini generation, Redis caching, and refresh cooldown behavior.
- Added `backend/src/modules/ai/scoring.service.js` for score breakdown calculation, score snapshot persistence, and bulk refresh helpers.
- Added `backend/src/jobs/scoreRefresh.job.js` and wired it into `backend/src/jobs/index.js` so score recalculation runs nightly.
- Added a `ScoreSnapshot` model plus supporting indexes in `backend/prisma/schema.prisma`.
- Mounted the new route groups in `backend/src/app.js`.
- Added test coverage in `backend/tests/analytics.ai.test.js`.
- Added a backend test script in `backend/package.json`.

### File register

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/src/config/redis.js` | Added | Provides optional Redis access for cached insights and refresh cooldowns |
| `backend/src/config/env.js` | Updated | Makes Redis and Gemini settings explicit and validated |
| `backend/src/integrations/gemini/gemini.client.js` | Added | Wraps Gemini HTTP calls behind a focused provider client |
| `backend/src/modules/analytics/analytics.controller.js` | Added | Exposes dashboard analytics through a controller layer |
| `backend/src/modules/ai/ai.controller.js` | Added | Exposes provider insight and score endpoints |
| `backend/src/modules/ai/insights.service.js` | Added | Builds insight payloads, caches them, and supports refresh cooldowns |
| `backend/src/modules/ai/scoring.service.js` | Added | Calculates score breakdowns and persists score snapshots |
| `backend/src/modules/transactions/transaction.service.js` | Updated | Adds monthly earnings, top-service aggregation, and provider analytics helpers |
| `backend/src/routes/analytics.routes.js` | Added | Mounts the dashboard analytics endpoint with auth checks |
| `backend/src/routes/ai.routes.js` | Added | Mounts insight and score endpoints with provider authorization |
| `backend/src/jobs/index.js` | Updated | Registers the nightly score refresh cron job |
| `backend/src/jobs/scoreRefresh.job.js` | Added | Recalculates provider scores on a schedule |
| `backend/src/app.js` | Updated | Registers the new analytics and AI routers in the application bootstrap |
| `backend/prisma/schema.prisma` | Updated | Adds the `ScoreSnapshot` model and relevant indexes |
| `backend/tests/analytics.ai.test.js` | Added | Verifies analytics aggregation and cached insight behavior |
| `backend/package.json` | Updated | Adds a reusable backend test command |

### How it works

The dashboard analytics endpoint is routed through `backend/src/routes/analytics.routes.js`, which requires authentication and provider authorization before handing off to the analytics controller. The controller calls `getProviderAnalytics()`, which combines the transaction summary, monthly earnings, top services, and recent transaction rows into one compact payload.

The AI insight path works the same way: `backend/src/routes/ai.routes.js` protects the endpoint, then `backend/src/modules/ai/insights.service.js` assembles provider metrics and sends them to Gemini through the provider client. If Redis has a cached payload, the service returns that instead of regenerating it. If the user forces refresh too often, a short cooldown key prevents repeated expensive calls.

The score path is handled in `backend/src/modules/ai/scoring.service.js`. It calculates a breakdown from booking activity, earnings, ratings, and tenure-like inputs, then writes both a `CreditScore` row and a `ScoreSnapshot` row so the latest state and historical trail are both available.

The nightly job in `backend/src/jobs/index.js` calls `backend/src/jobs/scoreRefresh.job.js`, which refreshes provider scores on a schedule. This keeps the score data up to date without requiring manual intervention.

### Important snippets

### Monthly earnings summary
File: `backend/src/modules/transactions/transaction.service.js`

```js
async function monthlyEarningsSummary(providerUserId) {
  return prisma.$queryRaw`
    SELECT
      date_trunc('month', t."createdAt")::date AS month,
      COALESCE(SUM(t.amount), 0) AS total
    FROM "Transaction" t
    WHERE t."userId" = ${providerUserId}
      AND t.status = 'SUCCESS'
      AND t.type IN ('ESCROW_RELEASE', 'WALLET_CREDIT')
    GROUP BY 1
    ORDER BY 1
  `;
}
```

### Redis cached insights
File: `backend/src/modules/ai/insights.service.js`

```js
const cacheKey = `insights:provider:${providerUserId}`;
const cached = await redisClient.get(cacheKey);
if (cached && !forceRefresh) {
  return JSON.parse(cached);
}
```

### Snapshot persistence during score refresh
File: `backend/src/modules/ai/scoring.service.js`

```js
const [creditScore, scoreSnapshot] = await Promise.all([
  prisma.creditScore.create({ data: scoreRecordData }),
  prisma.scoreSnapshot.create({ data: scoreRecordData })
]);
```

### Nightly job registration
File: `backend/src/jobs/index.js`

```js
cron.schedule('0 2 * * *', async () => {
  console.log('[Jobs] Running score refresh job');
  try {
    await runScoreRefreshJob();
  } catch (error) {
    console.error('[Jobs] Score refresh job failed:', error);
  }
});
```

## Implementation notes

- Gemini is the active AI provider for this phase, not Claude.
- Redis is optional in local development. If `REDIS_URL` or `REDIS_URI` is missing, the insights service still works with deterministic fallback logic.
- `ScoreSnapshot` duplicates the current score payload so historical score runs can be queried later without overwriting the latest score.
- Monthly earnings and top-service summaries rely on indexed columns to keep the dashboard responsive as transactions grow.
- The analytics payload is intentionally compact so chart and table views do not receive oversized responses.

## Verification checklist

- [x] Analytics endpoints return expected summaries on seeded or mocked data.
- [x] Score refresh job runs without errors and writes score records.
- [x] Cached insights are reused on repeated calls within the TTL window.
- [x] Redis fallback behavior does not block local development when `REDIS_URL` is absent.
- [x] Backend tests pass with `node --test tests/*.test.js`.

## Risks and follow-up notes

- Redis payload growth should be monitored if provider insight responses become larger over time.
- The score refresh job currently limits the refresh batch to keep the MVP predictable; this should be revisited when the dataset grows.
- A future rollup table may be useful if monthly raw transactions become too large for repeated dashboard aggregation.
- If additional AI providers are introduced later, provider routing should be centralized behind the same client interface used by Gemini today.
