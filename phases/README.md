# Phase Folder

This folder contains detailed documents per build phase, breaking down the Hajo hackathon MVP into logical, sequential steps.

## Phase Overview

**Recommended Implementation Order:**

### Backend Phases
1. **Phase 1 - Backend Foundation** (`backend/phase-1-backend-foundation.md`)
   - User auth, OTP verification, Squad virtual accounts
   
2. **Phase 2 - Core Features** (`backend/phase-2-backend-core-features.md`)
   - Booking lifecycle, escrow, wallet, transactions, reviews, scoring
   - **Note:** Phase 3.5 quotations build on top of Phase 2 bookings
   
3. **Phase 3 - Integration & Analytics** (`backend/phase-3-backend-integration-analytics.md`)
   - Analytics endpoints, Gemini AI insights, Redis caching, score refresh jobs
   - **Note:** Phase 3.5 quotations reuse the Gemini client from Phase 3
   
4. **Phase 3.5 - Quotation System & Split Escrow** ⭐ NEW
   - AI-powered quotation drafting, artisan review, customer negotiation
   - Split escrow: Materials released on acceptance, labour held until completion
   - See: [`phase-3.5-quotation-split-escrow-plan.md`](backend/phase-3.5-quotation-split-escrow-plan.md) and [`PHASE-3.5-QUOTATION-ROADMAP.md`](PHASE-3.5-QUOTATION-ROADMAP.md)

### Frontend Phases
1. **Phase 1 - Frontend Shell** (`frontend/phase-1-frontend-shell.md`)
   - Auth UI, landing page, navigation shell
   
2. **Phase 2 - Marketplace UX** (`frontend/phase-2-frontend-marketplace.md`)
   - Search, provider profiles, booking forms, wallet UI, dashboard shell
   - **Note:** Phase 3.5 quotations extend the booking flow with quotation screens
   
3. **Phase 3 - Dashboard & Provider Tools** (`frontend/phase-3-frontend-dashboard.md`)
   - Provider dashboard, analytics, services management
   - **Note:** Phase 3.5 quotations add artisan and customer quotation screens
   
4. **Phase 3.5 - Quotation System** ⭐ NEW
   - Artisan quotation review screens, customer response screens, negotiation thread
   - Same quotation backend from backend Phase 3.5
   - See: [`PHASE-3.5-QUOTATION-ROADMAP.md`](PHASE-3.5-QUOTATION-ROADMAP.md) for frontend phases H–K

### Integration Phase
4. **Phase 4 - Polish, Analytics, and Deploy** (`phase-4-polish-deploy.md`)
   - UI refinements, performance optimization, deployment to production

---

## Phase 3.5: Quotation System (Hackathon MVP)

**🎯 New for Hackathon:** The quotation system with split escrow is the key MVP feature for demo day.

### Quick Facts
- **Scope:** Sandbox Squad only (not production)
- **Effort:** ~18 hours (backend + frontend combined)
- **Timeline:** 3–4 days with 1–2 developers
- **Key Files:**
  - Detailed plan: [`backend/phase-3.5-quotation-split-escrow-plan.md`](backend/phase-3.5-quotation-split-escrow-plan.md)
  - Quick reference: [`PHASE-3.5-QUOTATION-ROADMAP.md`](PHASE-3.5-QUOTATION-ROADMAP.md)

### What Gets Built
- ✅ Quotation model with status tracking
- ✅ Gemini AI draft generation (reuses Phase 3 Gemini client)
- ✅ Artisan review & edit screens
- ✅ Customer accept/reject/negotiate responses
- ✅ Negotiation message thread (polled, 4-second interval)
- ✅ Split escrow: Materials released on acceptance, labour held until completion
- ✅ 48-hour escrow timeout auto-release job
- ✅ Demo seed data and walkthrough script

### Dependencies
- ✅ Phase 1 backend (auth foundation)
- ✅ Phase 2 backend (booking model, Squad integration)
- ✅ Phase 3 backend (Gemini client, Redis, AI routes)
- ✅ Phase 1–2 frontend (auth, dashboard shell, booking components)

---

## How to Use This Folder

1. **Start here:** Read this README to understand the overall flow
2. **Deep dive:** Open the phase doc you're implementing (e.g., `backend/phase-2-backend-core-features.md`)
3. **For quotations:** Start with [`backend/phase-3.5-quotation-split-escrow-plan.md`](backend/phase-3.5-quotation-split-escrow-plan.md) for the detailed plan, then [`PHASE-3.5-QUOTATION-ROADMAP.md`](PHASE-3.5-QUOTATION-ROADMAP.md) for quick reference
4. **Reference:** See `phase-docs-guide.md` for how phase docs are structured

---

## Progress Tracking

| Phase | Status | Backend Files | Frontend Files |
|-------|--------|---|---|
| 1 - Foundation | ✅ Complete | Auth, OTP, virtual accounts | Auth UI, landing page |
| 2 - Core Features | 🔄 In Progress | Booking, escrow, wallet | Marketplace search, profiles, bookings, wallet |
| 3 - Analytics | ✅ Complete | Analytics, AI insights, scoring, job scheduler | (Backend-only) |
| 3.5 - Quotation ⭐ | 📋 Planning | See Phase 3.5 plan (13 phases) | See Phase 3.5 plan (phases H–K) |
| 4 - Polish & Deploy | ⏳ Pending | Performance, security | UI refinements, responsive |

---

## Key References

- **System Design:** See `System_design_nextjs.md` for architecture overview
- **Design System:** See `docs/design.md` for UI/UX guidelines
- **Squad Integration:** See `docs/squad-sandbox-research.md` for Sandbox API details
- **Phase Documentation Guide:** See `docs/phase-docs-guide.md` for how to write phase docs
