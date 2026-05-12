<!-- BEGIN:nextjs-agent-rules -->
# Hajo Coding Agent Rules

This repository has a strict phase-based workflow. Follow these instructions before making any change.

## Required Reading Order

Before implementing anything, read the relevant context in this order:

1. The phase doc for the work you are about to do.
2. The other phase docs that the current phase depends on or affects.
3. The system design document in the system design folder, especially the Next.js version.
4. `docs/design.md` before any frontend work.
5. Any file-level docs or implementation notes that are directly related to the change.

If a task touches the frontend, `docs/design.md` must be read first. If a task touches backend behavior, read the backend phase docs and the system design before coding.

## Phase Boundaries

- Only write code or add features inside the current phase scope.
- Do not implement work outside the defined phases or the system design.
- If a request falls outside the current phase, document the dependency and defer it to the correct phase instead of improvising.
- Each phase must be understood in relation to the previous and next phases before anything is implemented.

## Design Discipline

- Keep the design simple, modern, and easy to navigate.
- Think from the user's perspective before placing a component.
- Ask: does this element improve clarity, or is it only decorative?
- Prefer clear spacing, sensible hierarchy, and full-screen layouts that are spacious but not wasteful.
- Use intentional background separation when cards or sections need emphasis.
- Use shadows only when they improve depth and readability.
- Use glassmorphism sparingly and intentionally for cards or buttons when it adds a modern depth effect.
- Always consider how a centered card, strong background contrast, or subtle motion affects usability.
- Use animation to clarify transitions and state changes, not as decoration.

## Frontend Rules

- **All frontend code must be placed in the `frontend/` or `app/` directories.** Never put frontend components, styles, or logic in the backend folder.
- Read `docs/design.md` before creating or modifying frontend code.
- Keep the frontend aligned with the design spec and the phase docs.
- Use the Next.js App Router structure and the file structure described in the system design.
- Build reusable components only when they clearly reduce duplication and improve consistency.
- Do not invent visual patterns that conflict with the design system.
- ENSURE AT ALL TIMES YOUR DESIGN ARE SCREEN RESPONSIVE ESPECIALLY A MOBILE FIRST DESIGN SYSTEM 

## Backend Rules

- **All backend code must be placed in the `backend/` directory.** Never put API routes, database logic, services, or business logic in the frontend folder.
- Follow the backend phase docs and system design for all API, database, integration, and job work.
- Keep routes, controllers, services, and validators separated.
- Add or update API tests in the backend test folder whenever backend behavior changes.
- The backend test folder should contain TypeScript files that can be run directly to test APIs we build.

## Testing and Validation

- After each phase or feature is built, run a lint check before moving on.
- After each phase or feature is built, run the relevant tests for that slice.
- If a change affects the backend, use the TypeScript API test files in the backend test folder.
- If a change affects the frontend, validate the affected screens and route behavior.
- Do not leave a phase without at least one focused validation step.

## Commit Discipline

- After each phase or feature is built and validated, write a git commit before starting the next one.
- Use a clear commit message that matches the phase or feature scope.
- Do not mix unrelated phase work in the same commit.

## Documentation Rules

- Update the relevant phase doc whenever files are added or behavior changes.
- Keep phase docs detailed.
- Each phase doc should include the files changed, what was implemented, how it works, why it was done, and any important snippets.
- When a phase depends on another phase, explain that dependency in the phase doc.
- Keep the system design and phase docs aligned with the actual code structure.

## Safety Rules

- **Do not write frontend code in the backend folder, and do not write backend code in the frontend folder.** Maintain strict separation of concerns by using the appropriate folder structure.
- Do not write code outside the phase and system design scope.
- Do not skip the design review for frontend work.
- Do not assume previous phase behavior is complete unless the relevant phase doc and files confirm it.
- If instructions conflict, follow the system design, then the phase doc, then this file.

## ENV
always creeate an env variable in the env.exaple file so the dev know what env varibles to find and include in the end file

<!-- END:nextjs-agent-rules -->
