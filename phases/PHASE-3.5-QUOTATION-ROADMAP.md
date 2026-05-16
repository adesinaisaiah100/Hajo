# Phase 3.5 Implementation Summary & Roadmap

## Overview

This document summarizes the quotation system and split-escrow implementation planning for the Hajo hackathon MVP. All work is scoped to **Sandbox Squad environment only** (not production).

---

## What Was Created

### 1. **Comprehensive Planning Document**
📄 **File:** `phases/backend/phase-3.5-quotation-split-escrow-plan.md`

A detailed 500+ line planning document covering:
- **Goal:** Quotation workflow (draft → review → response → split escrow)
- **Database models:** Quotation, NegotiationMessage, extended BookingStatus enum
- **Backend phases A–G:** Foundation → Service → Routes → Escrow → Webhooks → Jobs → Tests
- **Frontend phases H–K:** API client → Artisan screens → Customer screens → Thread component → Dashboard integration
- **13 sequential implementation steps** with effort estimates (total ~18 hours backend + frontend)
- **Demo seed data plan** for 2-minute hackathon demo
- **Sandbox assumptions** and how to transition to production
- **Verification checklist** and risks

### 2. **Updated Existing Phase Docs**

#### Backend Phase 2 (phase-2-backend-core-features.md)
- Added note: Phase 3.5 quotations extend the booking lifecycle from Phase 2
- Shows dependency: Phase 2 booking → Phase 3.5 quotation → Phase 2 completion flow
- Links to Phase 3.5 plan

#### Backend Phase 3 (phase-3-backend-integration-analytics.md)
- Added note: Phase 3.5 reuses Gemini integration from Phase 3 for quotation drafting
- Shows dependency: Phase 3 Gemini client → Phase 3.5 quotation generation
- Links to Phase 3.5 plan

#### Frontend Phase 2 (phase-2-frontend-marketplace.md)
- Added note: Phase 3.5 inserts quotation step between booking creation and acceptance
- Shows new screens: Artisan review, customer response, negotiation thread
- Shows integration points: Provider queue, customer bookings, booking card component
- Links to Phase 3.5 plan

#### Frontend Phase 3 (phase-3-frontend-dashboard.md)
- Added note: Phase 3.5 adds quotation screens to dashboard experience
- Lists artisan and customer quotation flows
- Shows new components and services
- Links to Phase 3.5 plan

---

## Implementation Phases at a Glance

| Phase | Name | Effort | Blocker | Key Files |
|-------|------|--------|---------|-----------|
| A | Database & Config | 1h | None | `schema.prisma`, `env.js` |
| B | Quotation Service | 3h | Phase A | `quotation.service.js`, `quotation.schemas.js`, `quotation.controller.js` |
| C | Routes & Bootstrap | 1h | Phase B | `quotations.routes.js`, `app.js` |
| D | Split Escrow Integration | 2h | Phase C | `squad.splitEscrow.js`, updated quotation service |
| E | Booking Status Updates | 1.5h | Phase D | `booking.service.js`, `webhook.handler.js` |
| F | Escrow Timeout Job | 1h | Phase E | `escrowTimeout.job.js` |
| G | Backend Tests | 1.5h | Phase F | `quotations.test.js` |
| H | Frontend API Client | 1h | Backend deployed | `quotations.api.ts`, `useQuotations.ts` |
| I | Artisan Review Screen | 2h | Phase H | `provider/quotations/[id]/page.tsx`, `QuotationReviewForm.tsx` |
| J | Customer Response Screen | 2h | Phase I | `customer/quotations/[id]/page.tsx`, `QuotationResponseForm.tsx` |
| K | Negotiation Thread | 1.5h | Phase J | `NegotiationThread.tsx`, polling integration |
| L | Dashboard Integration | 1.5h | Phase K | Updates to booking list/card components |
| M | Demo Seed Data | 1.5h | All phases | `demo.quotation.seed.js`, `demo-script.md` |

**Total effort:** ~18 hours backend + frontend combined  
**Estimated timeline for hackathon:** 3–4 days with 1–2 developers

---

## Key Design Decisions

### 1. **Gemini-Powered Draft Generation**
- When booking created: Auto-generate quotation draft with cost estimates
- Artisan can review and edit before sending
- Falls back to deterministic text if Gemini unavailable
- Uses Redis caching (same as Phase 3 analytics)

### 2. **Split Escrow on Acceptance**
- Materials cost: Released immediately to artisan on customer acceptance
- Labour cost: Held in escrow until artisan marks work complete
- 48-hour timeout: Auto-release labour if no completion (fairness safeguard)
- All split logic happens in `squad.splitEscrow.js` for clean separation

### 3. **Polling-Based Messages (MVP)**
- No WebSocket for hackathon MVP
- Frontend polls `GET /api/quotations/:id` every 4 seconds
- Includes quotation + all negotiation messages in response
- React Query handles caching and deduplication
- Post-hackathon: Upgrade to WebSocket for real-time collaboration

### 4. **Sandbox-Only (Hackathon)**
- All integration tests use Sandbox Squad credentials
- If `SQUAD_SECRET_KEY` not set: Falls back to deterministic mock
- Production transition: Only environment variable change needed (no code changes)
- Document mock behavior vs real behavior clearly for future reference

### 5. **Artisan & Customer Messaging**
- NegotiationMessage model captures thread history
- Each message: Sender (artisan/customer), text, optional suggested cost
- UI renders full thread with timestamps
- Artisan can accept suggested cost or propose counter-offer

---

## Database Model Summary

### New Enums
- **QuotationStatus:** DRAFT, SENT, ACCEPTED, REJECTED, NEGOTIATING, COMPLETED, CANCELLED
- **MessageSender:** ARTISAN, CUSTOMER

### New Models
- **Quotation:** Links to booking, stores draft + final costs, tracks split escrow refs
- **NegotiationMessage:** Links to quotation, stores message thread

### Extended Enum
- **BookingStatus:** Extended with QUOTE_REQUESTED, QUOTE_SENT, NEGOTIATING, ACCEPTED (replaces instant acceptance)

---

## Frontend Routes & Screens

### New Artisan Routes
```
/dashboard/provider/quotations/[id]
  → Review AI-drafted quotation
  → Edit materials/labour costs
  → Send to customer
  → View negotiation thread
```

### New Customer Routes
```
/dashboard/customer/quotations/[id]
  → View artisan's quotation
  → Accept / Reject / Negotiate
  → View negotiation thread (4-second polling)
```

### Updated Routes
```
/dashboard/provider/bookings
  → Now links to quotation review page when status = QUOTE_REQUESTED

/dashboard/customer/bookings
  → Now shows quotation status badge
  → Shows quotation costs (materials + labour)
```

---

## Backend API Endpoints

```
POST   /api/quotations
       Body: { bookingId }
       Response: { quotation with draft costs }

GET    /api/quotations/:id
       Response: { quotation, messages[], status }
       (Polling endpoint for 4-second interval)

PATCH  /api/quotations/:id
       Body: { finalMaterialsCost, finalLabourCost, description, action }
       Actions: 'send', 'negotiate'
       Response: Updated quotation

POST   /api/quotations/:id/accept
       Response: Quotation status = ACCEPTED, split escrow initiated

POST   /api/quotations/:id/reject
       Body: { reason? }
       Response: Quotation status = REJECTED

POST   /api/quotations/:id/messages
       Body: { message, suggestedCost? }
       Response: New NegotiationMessage
```

---

## Demo Flow (2 Minutes)

1. **Setup (30s):** Seed demo data with artisan, customer, and booking at PENDING status
2. **Create Quotation (20s):** Trigger quotation generation → shows Gemini draft
3. **Artisan Review (20s):** Open artisan screen → see draft → edit costs → send
4. **Customer Response (30s):** Open customer screen → see quotation → hit Accept
5. **Verify Split Escrow (20s):** Check transaction log → materials released, labour held
6. **Complete Booking (20s):** Artisan marks complete → verify labour released
7. **Summary (60s):** Show full quotation + negotiation history in UI

**Key points to highlight for judges:**
- ✅ AI-powered cost estimation (Gemini draft)
- ✅ Artisan review & edit flow
- ✅ Split escrow payment logic (materials vs labour)
- ✅ Negotiation thread with history
- ✅ Real-time polling (4-second updates)
- ✅ Full end-to-end flow in 2 minutes

---

## Dependencies & Prerequisites

### Backend Phase 3.5 Requires
- ✅ Phase 1: Auth & user foundation
- ✅ Phase 2: Booking model, Squad integration scaffold
- ✅ Phase 3: Gemini client, Redis config, AI routes
- ✅ PostgreSQL database with migrations

### Frontend Phase 3.5 Requires
- ✅ Phase 1: Auth shell
- ✅ Phase 2: Dashboard shell, booking components, React Query
- ✅ Phase 3: (None directly, but Phase 3.5 backend must be deployed)

### External
- ✅ Squad Sandbox API credentials (secret key)
- ✅ Gemini API key
- ✅ (Optional) Redis instance for caching

---

## Verification Checklist (Pre-Demo)

- [ ] Database models created and migration successful
- [ ] Quotation service methods tested (unit test > 80% coverage)
- [ ] API routes return 200 and correct payloads
- [ ] Split escrow logic works (materials released, labour held)
- [ ] Booking status transitions align with quotation state
- [ ] 48-hour timeout job runs without error
- [ ] Frontend polling works (messages update every 4 seconds)
- [ ] Artisan review screen functional and responsive
- [ ] Customer response screen functional and responsive
- [ ] Negotiation thread renders and updates in real-time
- [ ] Dashboard bookings show quotation status
- [ ] End-to-end flow works: booking → quotation draft → send → accept → complete
- [ ] Mobile responsive design verified
- [ ] Demo script completes in under 2 minutes

---

## Next Steps

### Immediate (Pre-Demo)
1. **Review Phase 3.5 planning doc** (`phases/backend/phase-3.5-quotation-split-escrow-plan.md`)
2. **Start Phase A (Database):** Update Prisma schema, run migration
3. **Parallel work:** Backend team starts Phase B–G, Frontend team preps Phase H
4. **Daily sync:** Check progress against 13-phase roadmap

### Post-Hackathon
- Upgrade message thread to WebSocket (real-time collab)
- Add disputes workflow (Phase 4)
- Add quotation templates/pricing rules for artisans
- Add multi-artisan payment splitting
- Add quotation version history for compliance
- Add production Squad integration (real API, not sandbox)

---

## File Structure Summary

### Backend Files to Create
```
backend/src/modules/quotations/
  ├── quotation.service.js      (Core business logic)
  ├── quotation.schemas.js       (Zod validation)
  └── quotation.controller.js    (HTTP handlers)

backend/src/integrations/squad/
  └── squad.splitEscrow.js       (Split payment logic)

backend/src/routes/
  └── quotations.routes.js       (API endpoints)

backend/tests/
  └── quotations.test.js         (Unit + integration tests)
```

### Backend Files to Update
```
backend/prisma/schema.prisma            (Add models + enums)
backend/src/config/env.js               (Add config)
backend/src/app.js                      (Mount routes)
backend/src/modules/booking/booking.service.js  (Status transitions)
backend/src/modules/webhooks/webhook.handler.js (Labour release)
backend/src/jobs/escrowTimeout.job.js          (48h timeout)
```

### Frontend Files to Create
```
frontend/app/(dashboard)/provider/quotations/[id]/page.tsx
frontend/app/(dashboard)/customer/quotations/[id]/page.tsx
frontend/app/components/provider/QuotationReviewForm.tsx
frontend/app/components/customer/QuotationResponseForm.tsx
frontend/app/components/shared/NegotiationThread.tsx
frontend/app/services/quotations.api.ts
frontend/app/hooks/useQuotations.ts
```

### Frontend Files to Update
```
frontend/app/(dashboard)/provider/bookings/page.tsx
frontend/app/(dashboard)/customer/bookings/page.tsx
frontend/app/components/shared/BookingCard.tsx
```

---

## Quick Reference

**Effort:** 18 hours | **Phases:** 13 sequential steps | **MVP Scope:** Sandbox Squad | **Demo Duration:** 2 minutes | **Dependencies:** Phase 1–3 backend, Phase 1–2 frontend | **Critical Path:** Phase A (db) → B (service) → C (routes) → D (escrow) → H (frontend api) → I (screens)
