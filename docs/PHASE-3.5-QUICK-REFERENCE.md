# Phase 3.5 Quick Reference Card

**Status:** ✅ COMPLETE & READY FOR TESTING

---

## What Changed

### Backend Integrations (4)
1. **booking.service.js** - Auto-triggers quotation generation
2. **squad.service.js** - Handles labour escrow release on webhook
3. **escrowTimeout.job.js** - Force-releases labour after 48h
4. **app.js** - Mounted quotation routes

### New Backend Components (6)
1. **quotation.service.js** - Generate, send, accept, reject, negotiate
2. **quotation.schemas.js** - Zod validation
3. **quotation.controller.js** - HTTP handlers
4. **quotations.routes.js** - API endpoints
5. **squad.splitEscrow.js** - Split escrow logic
6. **quotation.utils.js** - Helper functions

### New Frontend Components (7)
1. **quotations.api.ts** - API client
2. **useQuotations.ts** - React Query hooks (4s polling)
3. **QuotationReviewForm.tsx** - Artisan review
4. **QuotationResponseForm.tsx** - Customer response
5. **NegotiationThread.tsx** - Message display
6. **provider/.../quotations/[id]/page.tsx** - Artisan screen
7. **customer/.../quotations/[id]/page.tsx** - Customer screen

### Tests (3)
1. **quotations.test.js** - Unit tests
2. **quotations.integration.test.js** - Integration test structure
3. **test.utils.js** - Test helpers

### Documentation (3)
1. **phase-3.5-quotation-split-escrow-plan.md** - Full details
2. **PHASE-3.5-IMPLEMENTATION-SUMMARY.md** - Integration guide
3. **PHASE-3.5-COMPLETE.md** - Executive summary

---

## 5-Step Workflow

```
1. Booking Created
   → quotation.generateDraft() [AUTO]

2. Artisan Reviews
   → quotation.sendQuotation()

3. Customer Responds
   → quotation.accept/reject/negotiate()

4. Payment Split
   → Materials: Immediate
   → Labour: Held 48h

5. Timeout
   → escrowTimeout.job [AUTO]
   → Labour Auto-Released
```

---

## API Endpoints

| Method | Path | Action |
|--------|------|--------|
| POST | `/api/quotations` | Generate draft |
| GET | `/api/quotations/:id` | Get + messages (poll) |
| PATCH | `/api/quotations/:id` | Send/negotiate |
| POST | `/api/quotations/:id/accept` | Accept |
| POST | `/api/quotations/:id/reject` | Reject |
| POST | `/api/quotations/:id/messages` | Add message |

---

## Key Files

| File | Purpose |
|------|---------|
| booking.service.js | Trigger quotation |
| squad.service.js | Labour release |
| escrowTimeout.job.js | 48h timeout |
| quotation.service.js | Core logic |
| useQuotations.ts | Frontend hooks |

---

## Testing

```bash
npm run test                    # All tests
npm run test tests/quotations  # Quotation only
```

---

## Environment

```
QUOTATION_NEGOTIATION_POLL_INTERVAL=4000
GOOGLE_API_KEY=<optional>
SQUAD_SECRET_KEY=<optional>
```

---

## Database

```
npx prisma migrate dev --name add_quotations
npx prisma studio  # Verify
```

---

## Workflow States

### Booking Status
```
PENDING → QUOTE_REQUESTED → QUOTE_SENT → 
NEGOTIATING → ACCEPTED → ACTIVE → COMPLETED
```

### Quotation Status
```
DRAFT → SENT → NEGOTIATING → ACCEPTED → COMPLETED
```

### Payment
```
Materials: Released on ACCEPTED
Labour: Released on COMPLETED or 48h timeout
```

---

## Demo Script (2 min)

1. Create booking
2. Show quotation draft
3. Edit and send (artisan)
4. Accept (customer)
5. Show split (materials released)
6. Mark complete
7. Show labour released

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| No quotation | Check booking.status = QUOTE_REQUESTED |
| Labour not releasing | Check booking marked COMPLETED |
| Timeout not firing | Check acceptedAt > 48h, labourReleasedAt null |
| Messages not polling | Check GET /api/quotations/:id returns messages |

---

## Before Demo Day

- [ ] Database migration: `npx prisma migrate dev --name add_quotations`
- [ ] Test migration: `npx prisma studio`
- [ ] Run backend: `npm run dev`
- [ ] Run frontend: `npm run dev`
- [ ] Test booking → quotation flow
- [ ] Prepare demo data

---

## Files Summary

**Total:** 26 files created/updated  
**Backend:** 12 files  
**Frontend:** 7 files  
**Tests:** 3 files  
**Documentation:** 4 files  

---

**Everything is ready. Let's test and demo! 🚀**
