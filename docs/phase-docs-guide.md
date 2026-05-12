# Phase Documentation Guide

This guide defines how every phase document in `phases/` should be written while the project is being built.

## Purpose

Each phase file should be a single source of truth for the work planned or completed in that phase. It should let a developer understand:

- What is being built
- Which frontend and backend files are affected
- What code was added or changed
- How the implementation works
- Why the implementation exists
- What should be verified before moving to the next phase

## Required Structure

Every phase document should use this structure:

1. Title
2. Phase reference and scope
3. Goal summary
4. Frontend section
5. Backend section
6. File register table
7. Important code snippets
8. Implementation notes
9. Verification checklist
10. Risks and follow-up notes

## Writing Rules

- Always group the phase into two main sections: `Frontend` and `Backend`.
- Always include a clear phase reference such as `Phase 1`, `Phase 2`, and so on.
- Always list files that were added or changed.
- Always explain what was implemented, how it works, and why it was done that way.
- Always include the most important code snippets, not every line of code.
- Keep snippets short and focused on the core logic.
- Use concrete file paths.
- Use plain language that a developer can follow quickly.
- Keep the document detailed enough that someone can continue the work without re-reading the architecture doc.

## Recommended File Register Format

Use a table like this:

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/src/modules/auth/auth.service.ts` | Added | Handles OTP login and Squad account creation |
| `app/(auth)/login/page.tsx` | Updated | Adds the web login flow |

## Required Content for Each Section

### Frontend

Document:

- Pages added or changed
- Shared components added or changed
- State management updates
- API hooks or client changes
- UI behavior and loading states
- Any route changes

### Backend

Document:

- Routes added or changed
- Controllers, services, middleware, and integrations
- Database changes and Prisma updates
- Validation and security logic
- Webhook or cron behavior
- Any AI or Squad integration details

## Code Snippet Standard

Only include the most important snippets. Each snippet should have:


Example:

### OTP Verification Flow
File: `backend/src/modules/auth/auth.service.ts`

```
 const otp = generateOTP();
 await termii.sendSms(phone, `Your Hajo code is ${otp}`);
 

This snippet shows the OTP generation and SMS send step used during registration.

## Tone and Level of Detail

The writing should be technical, direct, and complete. Avoid vague summaries. If a file changed, say exactly what changed. If a behavior was introduced, explain the control flow.

## Frontend / Backend Balance

Each phase file should not be frontend-only or backend-only unless the phase truly contains only one side. Even in backend-heavy phases, mention the frontend touchpoints that depend on that work. Even in frontend-heavy phases, mention the backend APIs and contract details it consumes.

## Suggested Phase Naming

Use descriptive phase names such as:

- `Phase 1 - Backend Foundation`
- `Phase 2 - Core Features`
- `Phase 3 - Frontend Build`
- `Phase 4 - Polish, Analytics, and Deploy`

## Maintenance Rule

If a new file is added during a phase, add it to that phase document immediately. Do not wait until the end of the project.
