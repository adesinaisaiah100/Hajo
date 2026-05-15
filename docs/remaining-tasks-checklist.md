# Remaining Tasks Checklist for Demo Ready vs Full MVP Ready

This checklist turns the current Phase 3.5 state into a single execution list. It separates what is needed for a **demo-ready hackathon flow** from what is needed for a **full MVP-ready flow**.

## Short Answer

- **Supabase:** not required for the current MVP/demo path. Prisma can continue using `DATABASE_URL` against the existing Postgres setup.
- **Squad sandbox:** required for the payment story if you want to prove real payment behavior. The current mock split-escrow scaffold is enough for a fake/demo path, but not enough for a true sandbox proof.
- **Critical gap:** the quotation flow exists, but the booking flow, webhook flow, timeout job, dashboard screens, and test coverage still need to be aligned end-to-end.

---

## Demo Ready Checklist

These are the minimum changes needed to show the full quotation flow in a hackathon demo without pretending the implementation is production-complete.

### Backend

- [x] Quotation models and enums exist in `backend/prisma/schema.prisma`.
- [x] Quotation service exists in `backend/src/modules/quotations/quotation.service.js`.
- [x] Quotation routes exist in `backend/src/routes/quotations.routes.js`.
- [x] Quotation controller exists in `backend/src/modules/quotations/quotation.controller.js`.
- [x] Frontend quotation screens exist in `frontend/app/(dashboard)/provider/quotations/[id]/page.tsx` and `frontend/app/(dashboard)/customer/quotations/[id]/page.tsx`.
- [ ] Update `backend/src/modules/booking/booking.service.js` so booking creation clearly hands off into the quotation flow with a persisted quotation link and predictable status transition.
- [ ] Align `backend/src/modules/webhooks/squad.service.js` so labour release is driven by the quotation/split-escrow record, not only by generic booking completion.
- [ ] Finish `backend/src/jobs/escrowTimeout.job.js` so the 48-hour quotation timeout is the authoritative auto-release path for labour escrow.
- [ ] Add a booking-to-quotation lookup field or relation usage in the booking logic if the demo needs to jump from booking detail to quotation detail reliably.
- [ ] Add a small demo seed script under `backend/` or `backend/tests/` that creates one customer, one artisan, one service, one booking, one quotation, and one negotiation thread.

### Frontend

- [x] Quotation API wrapper exists in `frontend/app/services/quotations.api.ts`.
- [x] Quotation hooks exist in `frontend/app/hooks/useQuotations.ts`.
- [x] Artisan quotation form exists in `frontend/app/components/provider/QuotationReviewForm.tsx`.
- [x] Customer quotation form exists in `frontend/app/components/customer/QuotationResponseForm.tsx`.
- [x] Negotiation thread component exists in `frontend/app/components/shared/NegotiationThread.tsx`.
- [ ] Fix the auth import used by `frontend/app/(dashboard)/provider/quotations/[id]/page.tsx` and `frontend/app/(dashboard)/customer/quotations/[id]/page.tsx` so both pages use the actual auth store or the real app auth provider path.
- [ ] Wire `frontend/app/(dashboard)/provider/bookings/page.tsx` to open the quotation review screen when a booking is in quotation review state.
- [ ] Wire `frontend/app/(dashboard)/customer/bookings/page.tsx` and `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx` to show quotation status and navigate into the customer quotation response screen.
- [ ] Update `frontend/app/components/shared/BookingCard.tsx` so it shows quotation status, quotation total, and the action to continue the flow.
- [ ] Make sure the quotation pages handle loading, empty, and error states with the same visual system used elsewhere in the app.

### Demo Scope Decision

For demo ready, the payment and quotation flow can still use a mocked split-escrow backend as long as the screens and state transitions are visible and coherent. That means the demo can prove the product story without claiming the Squad sandbox transfer flow is fully production-real.

---

## Full MVP Ready Checklist

These are the changes required if you want the system to behave like a complete MVP, not just a demo narrative.

### Backend

- [ ] Replace the mock logic in `backend/src/integrations/squad/squad.splitEscrow.js` with real Squad sandbox API calls for split escrow initiation and release.
- [ ] Confirm `backend/.env` and `backend/.env.example` contain the exact Squad sandbox variables required for split escrow, webhook verification, and payment release.
- [ ] Add a dedicated booking-to-quotation state transition helper in `backend/src/modules/booking/booking.service.js` so booking status changes are consistent and not spread across multiple files.
- [ ] Ensure `backend/src/modules/webhooks/squad.service.js` can match labour release events by quotation reference and booking reference without ambiguity.
- [ ] Add a quotation completion path in the backend that updates the quotation record, booking record, and transaction record together in one transaction where possible.
- [ ] Add real backend unit assertions in `backend/tests/quotations.test.js` instead of only structural scenarios.
- [ ] Add real integration assertions in `backend/tests/quotations.integration.test.js` with seeded data and mocked external services.
- [ ] Add migration or schema cleanup if any booking/quotation relation fields are still missing from the Prisma model after real flow testing.
- [ ] Add a seed or fixture path for at least one accepted quotation that can survive the 48-hour timeout job test.

### Frontend

- [ ] Update `frontend/app/(dashboard)/provider/bookings/page.tsx` so provider users can jump from booking queue to quotation review without manual URL entry.
- [ ] Update `frontend/app/(dashboard)/customer/bookings/page.tsx` so customers can see quotation state and respond from the booking list.
- [ ] Update `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx` so the booking detail page becomes the hub for quotation and payment status.
- [ ] Update `frontend/app/components/shared/BookingCard.tsx` so it reflects quotation amount, quotation status, and the current next action.
- [ ] Confirm `frontend/app/hooks/useQuotations.ts` polling interval stays aligned with the backend config and does not overfetch.
- [ ] Add any missing route guards or auth redirects for quotation pages so they are safe in a real multi-role MVP.

### Operations / Demo Support

- [ ] Add a clear demo seed script or fixture command for local use.
- [ ] Add a repeatable manual demo script that maps the exact page order from booking creation to quotation acceptance to labour release.
- [ ] Verify the webhook endpoint path is reachable from Squad sandbox or a tunnel when testing the real flow.
- [ ] Decide whether the app will use local Postgres or managed Postgres for the MVP; if local is sufficient, Supabase can stay out of the runtime path.

---

## File-by-File Action List

### Backend files to update for demo ready

- `backend/src/modules/booking/booking.service.js`
- `backend/src/modules/webhooks/squad.service.js`
- `backend/src/jobs/escrowTimeout.job.js`
- `backend/tests/quotations.test.js`
- `backend/tests/quotations.integration.test.js`
- `backend/tests/test.utils.js`

### Frontend files to update for demo ready

- `frontend/app/(dashboard)/provider/quotations/[id]/page.tsx`
- `frontend/app/(dashboard)/customer/quotations/[id]/page.tsx`
- `frontend/app/(dashboard)/provider/bookings/page.tsx`
- `frontend/app/(dashboard)/customer/bookings/page.tsx`
- `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx`
- `frontend/app/components/shared/BookingCard.tsx`

### Backend files to finish for full MVP ready

- `backend/src/integrations/squad/squad.splitEscrow.js`
- `backend/src/modules/booking/booking.service.js`
- `backend/src/modules/webhooks/squad.service.js`
- `backend/src/jobs/escrowTimeout.job.js`
- `backend/.env.example`
- `backend/tests/quotations.test.js`
- `backend/tests/quotations.integration.test.js`

### Frontend files to finish for full MVP ready

- `frontend/app/(dashboard)/provider/bookings/page.tsx`
- `frontend/app/(dashboard)/customer/bookings/page.tsx`
- `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx`
- `frontend/app/components/shared/BookingCard.tsx`
- `frontend/app/(dashboard)/provider/quotations/[id]/page.tsx`
- `frontend/app/(dashboard)/customer/quotations/[id]/page.tsx`
- `frontend/app/hooks/useQuotations.ts`

---

## Supabase Decision

### Do we need Supabase?

For this current demo and MVP path, **no, not necessarily**.

What the codebase actually needs right now is:
- `DATABASE_URL` for Prisma
- A working Postgres database
- Optional storage only if you later add file uploads

Supabase is treated in the docs as an infrastructure option, but the current quotation flow does not depend on a Supabase client. So unless you want hosted Postgres or file storage, you can leave Supabase out of the runtime flow.

### When Supabase would matter

You would only need to bring Supabase back if you want:
- hosted Postgres instead of local Postgres
- Supabase Storage for profile photos or attachments
- a managed cloud deployment path that uses the Supabase connection string

For the quotation and split-escrow flow alone, Supabase is not required.

---

## Recommended Execution Order

### Demo ready order
1. Fix the quotation page auth import path.
2. Wire booking list and booking detail pages to quotation screens.
3. Make the booking service and webhook service reference quotation records consistently.
4. Finish the 48-hour timeout job behavior.
5. Add a demo seed script.
6. Run tests and capture a demo path.

### Full MVP ready order
1. Replace the Squad split-escrow mock with real sandbox API calls.
2. Tighten backend state transitions around booking and quotation completion.
3. Convert test scaffolding into real assertion-based coverage.
4. Finalize the frontend dashboard wiring for quotation status and actions.
5. Decide on local Postgres versus hosted Postgres and only use Supabase if you actually need it.

---

## Bottom Line

- **Demo ready:** mostly exists already; the remaining work is wiring, auth cleanup, booking-to-quotation navigation, timeout polish, and seed data.
- **Full MVP ready:** still needs real Squad sandbox split-escrow calls, stronger backend transaction/state handling, and real tests.
- **Supabase:** optional, not required for the current quotation/split-escrow MVP path.
