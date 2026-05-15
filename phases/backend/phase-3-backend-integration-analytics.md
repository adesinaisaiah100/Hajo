# Backend Phase 3 - Integration & Analytics

**Phase reference:** Backend Phase 3
**Scope:** Analytics endpoints, AI insight shaping, score narratives, caching, and score refresh automation.

## Goal
Provide stable analytics and insight endpoints for the dashboard experience, generate provider-facing AI summaries with caching, and persist repeatable score snapshots for downstream credit and reputation features.

## Frontend

No new frontend files were added in this phase, but the backend contracts introduced here are consumed by the provider dashboard, booking, and wallet surfaces already present in the app. The important integration points are:

- `GET /api/analytics/dashboard` for provider dashboard summaries.
- `GET /api/ai/insights` for provider insights and narrative summaries.
- `GET /api/ai/score` for provider score breakdowns.
- `GET /api/transactions/summary` for wallet and activity views.

These endpoints are designed for the existing dashboard shells and wallet screens so the UI can remain responsive even when AI generation is cold, because the services fall back to local computation and cached results.

## Backend

### What was implemented

- Added a Gemini-backed AI integration helper in `backend/src/integrations/gemini/gemini.client.js`.
- Added Redis helper support in `backend/src/config/redis.js` with safe fallback when Redis is not configured.
- Extended environment parsing in `backend/src/config/env.js` for `REDIS_URL`, `REDIS_URI`, `AI_PROVIDER`, `GOOGLE_API_KEY`, `GEMINI_MODEL`, and `GEMINI_API_BASE`.
- Added analytics and AI route layers in `backend/src/routes/analytics.routes.js` and `backend/src/routes/ai.routes.js`.
- Added controllers in `backend/src/modules/analytics/analytics.controller.js` and `backend/src/modules/ai/ai.controller.js`.
- Reworked transaction analytics in `backend/src/modules/transactions/transaction.service.js` so the same service can return user summaries, monthly earnings, top services, and provider analytics.
- Added provider insight shaping and Redis caching in `backend/src/modules/ai/insights.service.js`.
- Added provider score breakdown, snapshot persistence, and bulk refresh helpers in `backend/src/modules/ai/scoring.service.js`.
- Added nightly score refresh in `backend/src/jobs/scoreRefresh.job.js` and wired it into `backend/src/jobs/index.js`.
- Added a `ScoreSnapshot` model and supporting indexes in `backend/prisma/schema.prisma`.
- Updated `backend/src/app.js` so the new routes are mounted.
- Added backend test coverage in `backend/tests/analytics.ai.test.js`.
- Added a backend test script in `backend/package.json` so the full backend test set can be run consistently.

### File register

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/src/config/redis.js` | Added | Provides optional Redis access for cached AI responses and cooldown keys |
| `backend/src/config/env.js` | Updated | Makes Redis and Gemini configuration explicit and validated |
| `backend/src/integrations/gemini/gemini.client.js` | Added | Wraps Gemini HTTP calls behind a small provider client |
| `backend/src/modules/analytics/analytics.controller.js` | Added | Exposes the provider dashboard analytics endpoint |
| `backend/src/modules/ai/ai.controller.js` | Added | Exposes insight and score endpoints |
| `backend/src/modules/ai/insights.service.js` | Added | Builds provider insights, caches responses, and applies cooldown logic |
| `backend/src/modules/ai/scoring.service.js` | Added | Computes score breakdowns and persists snapshots |
| `backend/src/modules/transactions/transaction.service.js` | Updated | Adds monthly earnings, top service aggregation, and provider analytics helpers |
| `backend/src/routes/analytics.routes.js` | Added | Mounts dashboard analytics routing with auth checks |
| `backend/src/routes/ai.routes.js` | Added | Mounts AI insight and score routing with provider authorization |
| `backend/src/jobs/index.js` | Updated | Schedules the nightly score refresh job |
| `backend/src/jobs/scoreRefresh.job.js` | Added | Recalculates scores on a nightly schedule |
| `backend/src/app.js` | Updated | Registers the new analytics and AI routes in the app bootstrap |
| `backend/prisma/schema.prisma` | Updated | Adds the `ScoreSnapshot` model and performance indexes |
| `backend/tests/analytics.ai.test.js` | Added | Validates analytics aggregation and cached AI insight behavior |
| `backend/package.json` | Updated | Adds a reusable backend test command |

### How it works

The analytics path starts in `backend/src/routes/analytics.routes.js`, which requires auth and provider access before calling the analytics controller. That controller delegates to `getProviderAnalytics()`, which combines the user summary, monthly earnings, top services, and recent transactions into a single payload. The service uses Prisma for structured reads and raw SQL for the monthly aggregate so the payload stays small and chart-friendly.

The AI path starts in `backend/src/routes/ai.routes.js`, which protects both the insights and score endpoints. `backend/src/modules/ai/insights.service.js` builds a provider metrics object, passes it to the Gemini client when `GOOGLE_API_KEY` is present, and falls back to deterministic text if the provider is unavailable. Results are cached in Redis for 24 hours, and refresh requests are throttled with a short cooldown key so repeated dashboard loads do not trigger repeated AI calls.

The scoring path uses `backend/src/modules/ai/scoring.service.js` to calculate the score breakdown from bookings, earnings, rating, and tenure-like inputs. Each nightly run writes a new `CreditScore` record and a `ScoreSnapshot` record, which gives the app both a current state and an audit-friendly history of how the score evolved over time.

The nightly refresh job is registered in `backend/src/jobs/index.js` and runs from the same job bootstrap used for escrow timeout checks. That keeps the MVP simple while still separating scheduled work from request handlers.

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

- Gemini is the active AI provider for this phase. Claude references from the earlier scaffold were removed from the implementation notes and doc text.
- Redis is optional in local development. If `REDIS_URL` or `REDIS_URI` is missing, the AI service falls back to uncached execution rather than failing startup.
- The `ScoreSnapshot` model intentionally duplicates the current score payload so historical runs can be queried without overwriting the latest score.
- Monthly earnings and top-service summaries rely on indexed columns to keep provider dashboards responsive as transaction volume grows.
- The analytics endpoints return a compact payload with aggregated data plus recent rows so charts and tables can render without an oversized response.

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
- The AI layer currently uses Gemini directly with a deterministic fallback; if the product later adds more providers, provider routing should be centralized behind the same client interface.

## Extension: Phase 3.5 - Quotation System

**Note:** Phase 3.5 (Quotation System & Split Escrow) reuses the Gemini integration from Phase 3 for a new feature:
- When a booking is created, Phase 3.5 calls Gemini to auto-draft a quotation with cost estimates (materials + labour)
- The artisan can review/edit the draft and send it to the customer
- The customer can accept, reject, or negotiate
- Upon acceptance, a split escrow is initiated: materials released immediately, labour held until completion

Phase 3.5 depends on the Gemini client and Redis caching framework established in Phase 3, so those foundational pieces must be completed first.

See `phases/backend/phase-3.5-quotation-split-escrow-plan.md` for the full quotation implementation plan.
