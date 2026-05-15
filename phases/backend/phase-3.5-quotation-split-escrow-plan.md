# Backend Phase 3.5 - Quotation System & Split Escrow

**Phase reference:** Backend Phase 3.5 (Quotation & Split Escrow)  
**Scope:** Quotation lifecycle (AI draft → artisan review/edit → customer response → split-escrow payment)  
**Environment:** Sandbox Squad only (not production)  
**Target:** Hackathon MVP

---

## Goal

Enable a structured quotation workflow where:
1. **Quotation drafting:** When a customer requests a booking, Gemini auto-drafts a quotation with materials cost + labour cost.
2. **Artisan review:** The artisan can review, edit (reduce/increase), and send the quotation back.
3. **Customer response:** The customer can accept, reject, or negotiate the quotation.
4. **Split escrow:** Upon customer acceptance, Squad releases **materials cost immediately** and holds **labour cost until completion**.
5. **Completion & release:** When the artisan marks work complete, the labour portion is released.
6. **Negotiation thread:** Messages between artisan and customer are polled (4-second interval, no WebSocket for MVP).
7. **Demo readiness:** Seed data and a demo script to showcase the full flow within 2 minutes.

---

## Dependencies

- **Phase 2 Backend:** Booking routes, Squad integration scaffold, transaction webhook.
- **Phase 3 Backend:** Gemini integration, analytics/AI routes, Redis optional cache.
- **Phase 2 Frontend:** Booking form, dashboard shell, shared payment summary component.

This phase does NOT depend on previous frontend completion; the frontend screens for quotations are added as a new slice in the same phase.

---

## Database Model Changes

### New Enums

#### QuotationStatus
```prisma
enum QuotationStatus {
  DRAFT            // AI-generated, awaiting artisan review
  SENT             // Artisan sent to customer
  ACCEPTED         // Customer accepted
  REJECTED         // Customer rejected
  NEGOTIATING      // Customer requested changes
  COMPLETED        // Booking completed and split escrow finalized
  CANCELLED        // Quotation cancelled or booking cancelled
}
```

#### MessageSender
```prisma
enum MessageSender {
  ARTISAN
  CUSTOMER
}
```

### New Models

#### Quotation
```prisma
model Quotation {
  id                    String                 @id @default(cuid())
  bookingId             String                 @unique
  booking               Booking                @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  
  // Draft version (AI-generated)
  draftMaterialsCost    Float
  draftLabourCost       Float
  draftDescription      String                 @db.Text
  draftGeneratedAt      DateTime
  
  // Final version (after artisan edits, before sending)
  finalMaterialsCost    Float?
  finalLabourCost       Float?
  finalDescription      String?                @db.Text
  sentAt                DateTime?
  
  // Customer acceptance
  status                QuotationStatus        @default(DRAFT)
  acceptedAt            DateTime?
  
  // Split escrow references
  squadMaterialsRef     String?                // Squad transfer ref for materials
  squadLabourRef        String?                // Squad transfer ref for labour
  materialsReleasedAt   DateTime?
  labourReleasedAt      DateTime?
  
  // Timestamps
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt
  
  // Relations
  messages              NegotiationMessage[]
  
  @@index([bookingId])
  @@index([status])
}
```

#### NegotiationMessage
```prisma
model NegotiationMessage {
  id                 String                 @id @default(cuid())
  quotationId        String
  quotation          Quotation              @relation(fields: [quotationId], references: [id], onDelete: Cascade)
  
  sender             MessageSender
  message            String                 @db.Text
  suggestedCost      Float?                 // Customer can propose new cost
  createdAt          DateTime               @default(now())
  
  @@index([quotationId])
  @@index([createdAt])
}
```

### Extended BookingStatus Enum
```prisma
enum BookingStatus {
  PENDING             // Customer filled form, awaiting quotation draft
  QUOTE_REQUESTED     // AI draft generated, artisan sees it
  QUOTE_SENT          // Artisan sent final quotation to customer
  NEGOTIATING         // Customer is negotiating via messages
  ACCEPTED            // Customer accepted quotation → materials released, labour held
  ACTIVE              // Booking started (work in progress)
  COMPLETED           // Work complete, labour released
  CANCELLED           // Either party cancelled
  DISPUTED            // Dispute raised (Phase 4)
  REVIEW_PENDING      // Waiting for review after completion
}
```

### Prisma Schema Changes

**File:** `backend/prisma/schema.prisma`

- Add the three new enums: `QuotationStatus`, `MessageSender`
- Add the two new models: `Quotation`, `NegotiationMessage`
- Update the `BookingStatus` enum with the new statuses
- Add indexes on `Quotation.bookingId`, `Quotation.status`, and `NegotiationMessage.quotationId`

---

## Backend File Structure & Implementation Phases

### Phase A: Database & Configuration (Foundation)

**Files to create/modify:**

| File | Action | Purpose |
|---|---|---|
| `backend/prisma/schema.prisma` | Update | Add Quotation, NegotiationMessage models + enums |
| `backend/src/config/env.js` | Update | Add `QUOTATION_NEGOTIATION_POLL_INTERVAL` (default 4000ms) |
| `backend/.env.example` | Update | Document new quotation env variables |

**What to do:**
1. Add the three new enums and two new models to Prisma schema.
2. Create a migration: `npx prisma migrate dev --name add_quotations`.
3. Add polling interval config (optional; defaults to 4000ms).

**Verification:**
- Migration runs without error.
- `npx prisma generate` succeeds.
- New tables visible in `npx prisma studio`.

---

### Phase B: Quotation Service Layer (Business Logic)

**Files to create:**

| File | Action | Purpose |
|---|---|---|
| `backend/src/modules/quotations/quotation.service.js` | Create | Core quotation CRUD, status transitions, AI draft generation |
| `backend/src/modules/quotations/quotation.schemas.js` | Create | Zod schemas for quotation request/update validation |
| `backend/src/modules/quotations/quotation.controller.js` | Create | HTTP endpoints handler |

**What to do:**

1. **Quotation Service** (`quotation.service.js`):
   - `generateDraft(bookingId, customerDetails, serviceDetails)` → calls Gemini, returns cost breakdown
   - `sendQuotation(quotationId, finalMaterialsCost, finalLabourCost, description)` → updates status to SENT
   - `acceptQuotation(quotationId)` → status = ACCEPTED, initiates split escrow
   - `rejectQuotation(quotationId)` → status = REJECTED, cancels booking
   - `startNegotiation(quotationId, message, suggestedCost?)` → creates NegotiationMessage, status = NEGOTIATING
   - `respondToNegotiation(quotationId, message, acceptNewCost?)` → updates NegotiationMessage thread
   - `getQuotationWithMessages(quotationId)` → fetch quotation + all messages for polling UI

2. **Quotation Schemas** (`quotation.schemas.js`):
   - `acceptQuotationSchema` → validates quotation ID
   - `sendQuotationSchema` → validates materials/labour costs (> 0, reasonable bounds)
   - `negotiationMessageSchema` → validates message text + optional suggested cost
   - `updateQuotationSchema` → validates artisan edits before sending

3. **Quotation Controller** (`quotation.controller.js`):
   - Route handlers for all service methods (see routes section below)

---

### Phase C: Quotation Routes & Integration (API Layer)

**Files to create/modify:**

| File | Action | Purpose |
|---|---|---|
| `backend/src/routes/quotations.routes.js` | Create | Quotation API endpoints |
| `backend/src/app.js` | Update | Mount quotation routes |

**What to do:**

1. **Routes** (`quotations.routes.js`):
   ```
   POST   /api/quotations
           → generateDraft (booking ID in body)
   
   GET    /api/quotations/:id
           → getQuotationWithMessages (polling endpoint)
   
   PATCH  /api/quotations/:id
           → sendQuotation or startNegotiation (based on action)
   
   POST   /api/quotations/:id/accept
           → acceptQuotation (customer endpoint)
   
   POST   /api/quotations/:id/reject
           → rejectQuotation (customer endpoint)
   
   POST   /api/quotations/:id/messages
           → addNegotiationMessage (artisan or customer)
   ```

2. **App bootstrap** (`app.js`):
   - Mount quotation routes: `app.use('/api/quotations', quotationsRoutes)`

---

### Phase D: Split Escrow & Payment Logic (Squad Integration)

**Files to create/modify:**

| File | Action | Purpose |
|---|---|---|
| `backend/src/integrations/squad/squad.splitEscrow.js` | Create | Split the escrow into materials + labour releases |
| `backend/src/modules/quotations/quotation.service.js` | Update | Call split escrow on quotation acceptance |

**What to do:**

1. **Split Escrow Integration** (`squad.splitEscrow.js`):
   - `initiateSplitEscrow(bookingData, materialsCost, labourCost)` 
     - Creates two virtual "holds" in Squad: one for materials, one for labour
     - **Materials:** Released immediately on acceptance (call Squad transfer to artisan)
     - **Labour:** Held in escrow, released only on booking completion
     - Returns `{ materialsRef, labourRef }`
   
   - **Sandbox assumption:** Squad Sandbox supports partial releases via transfer endpoint
   - **Real logic:** Each portion is tracked separately in the Quotation model
   
2. **Quotation Service Update:**
   - In `acceptQuotation()`, call `initiateSplitEscrow()` and save `squadMaterialsRef` + `squadLabourRef`
   - Set `materialReleasedAt = now()` (immediate)
   - Set `labourReleasedAt = null` (wait for completion)

---

### Phase E: Booking Status & Webhook Updates

**Files to modify:**

| File | Action | Purpose |
|---|---|---|
| `backend/src/modules/booking/booking.service.js` | Update | Add quotation transitions to booking lifecycle |
| `backend/src/modules/webhooks/webhook.handler.js` | Update | Handle split escrow release events from Squad |

**What to do:**

1. **Booking Lifecycle Update** (`booking.service.js`):
   - When booking created: status = PENDING, generate quotation draft
   - When quotation sent: status = QUOTE_SENT
   - When quotation negotiating: status = NEGOTIATING
   - When quotation accepted: status = ACCEPTED, split escrow initiated
   - When artisan marks complete: status = COMPLETED, labour released

2. **Webhook Handler Update** (`webhook.handler.js`):
   - Listen for `transfer.success` events from Squad
   - If event matches `squadLabourRef`, update `Quotation.labourReleasedAt`
   - Trigger booking completion workflow

---

### Phase F: Escrow Timeout Job (Auto-Release)

**Files to create/modify:**

| File | Action | Purpose |
|---|---|---|
| `backend/src/jobs/escrowTimeout.job.js` | Update | Add 48-hour labour escrow timeout |

**What to do:**

1. Extend the existing escrow timeout job:
   - Query all quotations with status = ACCEPTED where `acceptedAt < now() - 48 hours`
   - For each: if labour not released, force-release it (auto-close booking)
   - Update status to COMPLETED
   - Log the event for audit

---

### Phase G: Testing & Validation

**Files to create/modify:**

| File | Action | Purpose |
|---|---|---|
| `backend/tests/quotations.test.js` | Create | Unit tests for quotation flow |

**What to do:**

1. Test suite covering:
   - Generate draft → returns valid cost breakdown
   - Artisan sends → status transitions correctly
   - Customer accepts → split escrow initiated
   - Customer negotiates → message thread created
   - Labour release on completion → Quotation updated
   - 48-hour timeout → auto-release works

---

## Frontend File Structure & Implementation Phases

### Phase H: Quotation Review Screen (Artisan)

**Files to create:**

| File | Action | Purpose |
|---|---|---|
| `frontend/app/(dashboard)/provider/quotations/[id]/page.tsx` | Create | Artisan quotation review & edit interface |
| `frontend/app/components/provider/QuotationReviewForm.tsx` | Create | Form to edit costs, description, and send |
| `frontend/app/hooks/useQuotations.ts` | Create | React Query hooks for quotation polling |
| `frontend/app/services/quotations.api.ts` | Create | Quotation API client wrapper |

**What to do:**

1. **Quotation Review Page** (`app/(dashboard)/provider/quotations/[id]/page.tsx`):
   - Display AI-drafted costs (read-only)
   - Show artisan edit form for materials/labour cost and description
   - Button to send quotation to customer
   - Link back to provider booking queue

2. **Quotation Review Form** (`components/provider/QuotationReviewForm.tsx`):
   - Input fields for final materials + labour costs
   - Textarea for description
   - Cost validation (> 0, reasonable bounds)
   - Submit triggers `sendQuotation()` API call

3. **React Query Hooks** (`hooks/useQuotations.ts`):
   - `useQuotation(quotationId)` → fetch and subscribe (polling)
   - `useSendQuotation()` → mutation for sending
   - `useNegotiationMessages(quotationId)` → poll messages every 4 seconds

4. **API Client** (`services/quotations.api.ts`):
   - `getQuotation(id)` → GET /api/quotations/:id
   - `sendQuotation(id, payload)` → PATCH /api/quotations/:id
   - `addMessage(id, message)` → POST /api/quotations/:id/messages

---

### Phase I: Quotation Response Screen (Customer)

**Files to create:**

| File | Action | Purpose |
|---|---|---|
| `frontend/app/(dashboard)/customer/quotations/[id]/page.tsx` | Create | Customer quotation response interface |
| `frontend/app/components/customer/QuotationResponseForm.tsx` | Create | Accept/reject/negotiate form |

**What to do:**

1. **Quotation Response Page** (`app/(dashboard)/customer/quotations/[id]/page.tsx`):
   - Display artisan's quotation (materials + labour + description)
   - Show negotiation message thread (polled)
   - Three action buttons: Accept, Reject, Negotiate
   - Back button to customer bookings

2. **Quotation Response Form** (`components/customer/QuotationResponseForm.tsx`):
   - Accept button → calls `acceptQuotation(quotationId)`
   - Reject button → calls `rejectQuotation(quotationId)` with optional reason
   - Negotiate button → open text input for counter-offer with suggested cost
   - Display negotiation history below

---

### Phase J: Negotiation Thread (Polled Messages)

**Files to create:**

| File | Action | Purpose |
|---|---|---|
| `frontend/app/components/shared/NegotiationThread.tsx` | Create | Render negotiation messages with polling |

**What to do:**

1. **Negotiation Thread Component** (`components/shared/NegotiationThread.tsx`):
   - Display all messages in chronological order
   - Show sender (Artisan or Customer), timestamp, message text
   - If message includes `suggestedCost`, show as a highlighted counter-offer
   - Auto-refresh every 4 seconds via React Query polling
   - Show loading state while polling
   - Handle "no messages yet" state

---

### Phase K: Integration with Booking & Wallet (Dashboard Updates)

**Files to modify:**

| File | Action | Purpose |
|---|---|---|
| `frontend/app/(dashboard)/customer/bookings/page.tsx` | Update | Show quotation status in booking list |
| `frontend/app/(dashboard)/provider/bookings/page.tsx` | Update | Link to quotation review from booking queue |
| `frontend/app/components/shared/BookingCard.tsx` | Update | Display quotation cost summary |

**What to do:**

1. **Customer Bookings List:**
   - Add a column or badge showing "Awaiting quotation response" if status = QUOTE_SENT
   - Link to quotation detail page when clicked

2. **Provider Bookings Queue:**
   - Add a badge showing "Review quotation" if status = QUOTE_REQUESTED
   - Link to quotation review page

3. **Booking Card Component:**
   - Show quotation costs (materials + labour) if quotation exists
   - Show negotiation count if NEGOTIATING

---

## Implementation Phases: Sequential Order

### **Step 1:** Database & Foundation (Phase A)
1. Update `backend/prisma/schema.prisma`
2. Run migration
3. Verify in Prisma Studio

**Effort:** 1 hour  
**Blocker:** None  
**Verification:** Migration runs, new tables exist

---

### **Step 2:** Quotation Service & Validation (Phase B)
1. Create `backend/src/modules/quotations/quotation.service.js`
2. Create `backend/src/modules/quotations/quotation.schemas.js`
3. Create `backend/src/modules/quotations/quotation.controller.js`

**Effort:** 3 hours  
**Blocker:** Phase A complete  
**Verification:** Unit tests for each method pass

---

### **Step 3:** Quotation Routes & App Bootstrap (Phase C)
1. Create `backend/src/routes/quotations.routes.js`
2. Update `backend/src/app.js` to mount quotation routes
3. Test routes with Postman or curl

**Effort:** 1 hour  
**Blocker:** Phase B complete  
**Verification:** POST /api/quotations returns 200, GET polling works

---

### **Step 4:** Split Escrow Integration (Phase D)
1. Create `backend/src/integrations/squad/squad.splitEscrow.js`
2. Update `backend/src/modules/quotations/quotation.service.js` to call split escrow on accept
3. Test split escrow flow with mock data

**Effort:** 2 hours  
**Blocker:** Phase C complete, Squad Sandbox credentials configured  
**Verification:** Quotation acceptance triggers split escrow, materials released immediately

---

### **Step 5:** Booking Status Updates (Phase E)
1. Update `backend/src/modules/booking/booking.service.js` with quotation status transitions
2. Update `backend/src/modules/webhooks/webhook.handler.js` to handle labour release
3. Test booking + quotation state machine

**Effort:** 1.5 hours  
**Blocker:** Phase D complete  
**Verification:** Booking status reflects quotation state; webhook triggers labour release

---

### **Step 6:** Escrow Timeout Job (Phase F)
1. Update `backend/src/jobs/escrowTimeout.job.js` to include 48-hour labour timeout
2. Test job with seeded data

**Effort:** 1 hour  
**Blocker:** Phase E complete  
**Verification:** Job runs, timeout triggering works

---

### **Step 7:** Backend Tests (Phase G)
1. Create `backend/tests/quotations.test.js`
2. Run full test suite: `npm run test`
3. Validate all flows pass

**Effort:** 1.5 hours  
**Blocker:** Phase F complete  
**Verification:** All tests pass, coverage > 80%

---

### **Step 8:** Frontend: Quotation Polling & API Client (Phase H, Part 1)
1. Create `frontend/app/services/quotations.api.ts`
2. Create `frontend/app/hooks/useQuotations.ts`
3. Test polling interval (4 seconds)

**Effort:** 1 hour  
**Blocker:** Backend routes deployed and responding  
**Verification:** Polling works, messages update in real-time on page

---

### **Step 9:** Frontend: Artisan Quotation Review Screen (Phase H)
1. Create `frontend/app/components/provider/QuotationReviewForm.tsx`
2. Create `frontend/app/(dashboard)/provider/quotations/[id]/page.tsx`
3. Link from provider booking queue
4. Test form validation and submission

**Effort:** 2 hours  
**Blocker:** Phase H Part 1 complete  
**Verification:** Artisan can edit costs and send quotation; state updates in dashboard

---

### **Step 10:** Frontend: Customer Quotation Response Screen (Phase I)
1. Create `frontend/app/components/customer/QuotationResponseForm.tsx`
2. Create `frontend/app/(dashboard)/customer/quotations/[id]/page.tsx`
3. Test accept/reject/negotiate actions

**Effort:** 2 hours  
**Blocker:** Phase I complete  
**Verification:** Customer can respond to quotation; backend state updates

---

### **Step 11:** Frontend: Negotiation Thread Component (Phase J)
1. Create `frontend/app/components/shared/NegotiationThread.tsx`
2. Integrate into quotation response page
3. Test polling and message rendering

**Effort:** 1.5 hours  
**Blocker:** Phase J complete  
**Verification:** Messages poll in real-time, new messages appear within 4 seconds

---

### **Step 12:** Frontend: Dashboard Integration (Phase K)
1. Update booking list/card components to show quotation status
2. Test navigation between bookings and quotations
3. Verify UI consistency with design system

**Effort:** 1.5 hours  
**Blocker:** Phase K complete  
**Verification:** Bookings dashboard shows quotation status and links; responsive on mobile

---

### **Step 13:** Demo Seed Data & Script (Bonus)
1. Create `backend/seeds/demo.quotation.seed.js`
2. Populate seed data: artisan profile, customer profile, booking with quotation at each status
3. Create demo script (`docs/demo-script.md`) to walk through quotation flow end-to-end

**Effort:** 1.5 hours  
**Blocker:** Steps 1–12 complete  
**Verification:** `npm run seed` populates demo data; demo script completes in < 2 minutes

---

## Important Implementation Notes

### Gemini Integration Point
When a booking is created in Step 2:
1. Customer submits booking form with service type, description, location, budget range
2. Booking service immediately calls `quotation.service.generateDraft(bookingId, customerDetails, serviceDetails)`
3. This method prompts Gemini: *"Based on a {serviceType} booking in {location}, estimate materials and labour costs. Return JSON: { materialsCost, labourCost, description }"*
4. Gemini response is parsed and stored in `Quotation.draftMaterialsCost`, `draftLabourCost`, `draftDescription`
5. Artisan sees this draft and can edit before sending

### Split Escrow Flow (Sandbox Assumption)
- When quotation accepted: Squad receives total escrow charge (materials + labour)
- System calls `squad.splitEscrow.initiateSplitEscrow()` which:
  - Transfers materials portion to artisan immediately (Squad transfer endpoint)
  - Holds labour portion in a separate escrow reference
  - Returns `{ materialsRef, labourRef }`
- On booking completion: System calls `squad.splitEscrow.releaseLaborEscrow(labourRef)` to transfer labour to artisan
- If 48 hours pass without completion: Auto-release job forces labour release

### Polling-Based Messages (No WebSocket)
- Frontend polls `GET /api/quotations/:id` every 4 seconds
- Response includes `quotation` object + `messages` array
- React Query caches result and updates on poll interval
- UI renders `NegotiationThread` with messages in real-time feel

### Sandbox-Specific Mocking
- If `SQUAD_SECRET_KEY` is not set: Use mock split escrow that logs transfers but doesn't call Squad API
- Allows frontend testing without Sandbox credentials in local dev
- Production transition: Only swap env key; no code changes needed

---

## Verification Checklist

- [ ] Database models created and migration successful
- [ ] Quotation service methods tested (generate, send, accept, negotiate)
- [ ] API routes return 200 and correct payloads
- [ ] Split escrow logic initiates on quotation acceptance
- [ ] Booking status transitions align with quotation state
- [ ] 48-hour timeout job runs without error
- [ ] Backend test suite passes (> 80% coverage)
- [ ] Frontend polling works (messages update every 4 seconds)
- [ ] Artisan can review and edit quotation
- [ ] Customer can accept/reject/negotiate quotation
- [ ] Negotiation thread displays messages in real-time
- [ ] Dashboard bookings show quotation status
- [ ] End-to-end demo flow works: create booking → draft quotation → send → accept → complete (< 2 minutes)
- [ ] Mobile responsive design verified

---

## Risks & Follow-Up Notes

### Risks
1. **Sandbox Squad split escrow assumptions:** If Squad Sandbox doesn't support partial/sequential transfers, fallback to mock and document for production transition.
2. **Polling latency:** 4-second interval may feel slow on negotiation; consider WebSocket upgrade post-hackathon.
3. **Data consistency:** Concurrent updates (both artisan and customer editing) not handled; add optimistic locking if needed post-hackathon.
4. **Customer drops quotation:** If customer abandons quotation (booking not deleted), labour escrow auto-releases after 48 hours; document this in customer ToS.

### Follow-Ups (Post-Hackathon)
- Upgrade message thread to WebSocket for real-time collab
- Add disputes workflow (Phase 4)
- Add quotation templates/pricing rules for artisans
- Add payment splitting across multiple artisans (team bookings)
- Add quotation history/versioning for compliance
