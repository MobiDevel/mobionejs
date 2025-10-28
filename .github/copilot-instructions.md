<!-- AI Agent Guidance for MobiOne Monorepo -->

## Mandatory Azure Rule

- @azure Rule - Use Azure Best Practices: When generating code for Azure, running terminal commands for Azure, or performing operations related to Azure, invoke your `azure_development-get_best_practices` tool if available.

## Repository Topology (not monorepo)

- `mobisaas/` Expo React‑Native app (mobile + web) – OTA via Expo, Storybook optional.
- `mobione-plan/` Next.js (App Router) planning web app (drag & drop planning UI, high test coverage).
- `mobione-api/` Fastify + Zod HTTP API (Swagger @ /swagger) – uses `@mobidevel/mobione-sdk` models.
- `mobione-sdk/` Domain models, pure logic (no React), strict types + Zod schemas; never introduce React/UI deps here.
- `components-react/` Shared web React components (MUI based).
- `thermalib-expo/` Native module / thermal printing integration.
- `mobibot/` Chat/AI related Next.js app (vector store, crawling scripts).

## Big Picture Architecture

- Data & Models: Centralized in `mobione-sdk` (pure functions + Zod schemas). All other packages import from here to avoid duplication.
- API Layer: `mobione-api` exposes HTTP endpoints (Fastify). Each route validates input with Zod → central error handler maps validation issues to 400 `{ details: [...] }`.
- Web Planning App: `mobione-plan` consumes API (or mocked data in tests) + SDK models. Uses React Query for caching loads/orders; drag/drop orchestrated via `onDragEnd` dispatcher.
- Mobile / Expo: `mobisaas` shares domain models; UI built with React Native + Expo modules (thermal printing via `thermalib-expo`).
- Shared UI: `components-react` supplies reusable MUI components; never place domain logic here—only presentation + lightweight formatting.
- AI / Chat: `mobibot` handles vector store ingestion & chat routes, reusing SDK types for semantic integrity.
- Native Integration: `thermalib-expo` delivers device capabilities to the mobile app; keep its public API minimal & strongly typed.
- Dependency Direction (must remain acyclic): `mobione-sdk` ← (imported by) everything; UI layers never import from API source; cross-app styling consolidated in shared components where practical.

## Critical Developer Workflows

- Install (monorepo): Run `npm install` in each package root (no Yarn). Set up `.npmrc` with GitHub PAT for private `@mobidevel/*` packages.
- Mobile App Dev: `npm run expo:prepare` → `npm run start` (or `npm run start:sb` for Storybook) → open device/simulator (`npm run ios` / `npm run android`).
- Planning App Dev: `npm run dev` for live reload; `npm start` to exercise packaged standalone (mirrors Azure deployment). Use `FORCE_BUILD=true` / `FORCE_PACKAGE=true` envs to regenerate.
- API Dev: (In `mobione-api`) build or run directly via ts-node (check `package.json` scripts); inspect Swagger at `/swagger` after startup.
- Tests:
  - Typical: `npm test` (CI mode), local faster cycle: `npm test:dev` or `npm run test:watch`.
  - Add new planning rule: write failing test first under `_actions/__tests__/`, assert `/Blocked:/` message, then implement guard.
- Lint & Type Check: Triggered automatically in most build scripts; explicit with `npm run lint` (keep zero warnings unless justified).
- Drag & Drop Debugging: Use structured droppable `data.type`; leverage global `__planningPointerRef` in tests to simulate pointer coordinates for no-target fallback scenarios.
- Cache Invalidation: After any mutation altering loads or orders, invalidate `[Collections.orders]` and `[Collections.loads]` once (batch with `Promise.all`).
- Azure Plan Deployment: Produce `release` via `npm run package:standalone`; startup command ensures temp dirs then runs `node .next/standalone/server.js`.
- SDK Publishing: Bump version with `npm run version:next`, push tag, GitHub Action publishes; consuming apps update dependency & reinstall.
- Local SDK Testing: `npm run build` in SDK, then `npm pack` and install tarball in target package for pre-publish validation.

## Core Conventions

1. Strict TypeScript: never use `any`; prefer precise domain types from `@mobidevel/mobione-sdk`. Introduce a local type alias if an external lib lacks types—do not suppress with `any`. Use named exports and avoid index files / re-exports whenever possible.
2. Separation of Concerns:
   - UI components live in feature folders (`_components`); server/data mutations in `_actions` (Next.js server actions or pure async functions).
   - Do not mix data fetching/mutation logic into visual components—extract into an action or hook.
   - Keep React Contexts narrowly scoped (e.g. `DialogContext`, `PlanningContext`). Do not add unrelated state to existing contexts; create a new one instead.
3. Message / Feedback Pattern: All planning feedback strings flow through `classifyPlanningMessage` → drives toast/dialog severity. To create a new error state, prefix message with `Blocked:` or include `Error`/`Failed` instead of reinventing severity logic.
4. Drag & Drop (Planning UI): Use `dnd-kit`. Item ids are structured (`order-<id>-visit-<visitId>` etc.). Add new drop behavior inside `onDragEnd` branching by explicit droppable `data.type`. Never infer context solely from string parsing if you can pass structured `data`.
5. “Blocked” Business Rules: Early-return with a concise string starting `Blocked:`; tests assert on these messages. Keep wording stable—append detail after a colon.
6. Mutations + Cache: After successful planning mutations invalidate React Query keys: `[Collections.orders]`, `[Collections.loads]`. Batch invalidations with `Promise.all` where possible.
7. Domain Logic Location: If logic is purely about entities (orders, loads, visits) and has no framework side-effects, prefer implementing in `mobione-sdk` (or extend there) to enable reuse across API, mobile, and web.
8. Zod & Validation: API routes (Fastify) rely on Zod via `fastify-type-provider-zod`. When adding a route: define schema, register route module, rely on central error handler for validation → return 400 with `details` array.
9. No Cross-Layer Imports: UI layers must not import from API source; both may import from `mobione-sdk`. Shared visual components import from `components-react`; planning app should not duplicate styling logic present there.
10. Naming: Use `getX`, `updateX`, `addOrUpdateX`, `ParseX` (sdk parse/validate) patterns. Avoid ambiguous verbs.
11. Immutable Updates: Prefer pure functions using existing helper utilities (Immer is used in mobile app; planning app typically uses pure cloning or SDK helpers—stay consistent with local style).
12. Async Error Surfacing: Convert thrown technical errors to user-friendly phrases via `friendlyErrors.ts` before classifying; do not leak raw stack traces or object dumps.
13. Testing:
    - Jest + Testing Library across packages; test files under `__tests__` near code.
    - Prefer message regex expectations on key substrings (e.g. `/Blocked:/`) to reduce brittleness.
    - When adding drag-drop tests, use provided test aids (e.g. global `__planningPointerRef`) instead of DOM hacks.
14. Build / Scripts:
    - Mobile (`mobisaas`): `npm run expo:prepare`, `npm run start`, `npm run start:sb` for Storybook.
    - Plan app: `npm run dev`, `npm start` (standalone parity), `npm run package:standalone` for release folder.
    - API: run with `ts-node` or build then `node build/app.js` (check `scripts`). Ensure Swagger still loads.
15. Azure Deployment (Plan App): Produces standalone `.next` packaged into `release`; startup command must create writable temp dirs then run `node .next/standalone/server.js`.
16. Adding a New Business Rule (Planning):
    - Guard in lowest-level action (`onDragEnd` or specific handler) → return `Blocked:` message.
    - Add/adjust test under `_actions/__tests__/*` asserting message.
    - If UI reaction differs, adapt only classifier (avoid scattered string includes).
17. ID & Selection Handling: Bulk moves rely on `multiSelect` toggle; when clearing selection increment `clearSelectionToken` to force grid state reset instead of mutating grid internals.
18. Performance: Avoid re-creating large arrays inside render; memoize derived collections (`useMemo`) keyed on raw query data & `selectedDate`. For pointer tracking rely on passive listeners—remove on cleanup.
19. Do Not Silence ESLint: Replace unsafe code with typed helpers (e.g. add `isOrderRouted(order)` instead of casting). Suppressions require justification comments.
20. PR Scope Guidelines: Keep diffs focused: one feature or rule per PR; update tests & instructions alongside changes affecting patterns.

## Examples

- Blocking routed order drop (in `onDragEnd` visit branch): early return `'Blocked: only unplanned orders can be dropped onto a visit'`.
- Cross-load visit move guard: return `'Blocked: visits cannot be moved between loads'` in `handleVisitReorder`.
- Classify new message: ensure it matches existing regex sets or extend `classifyPlanningMessage` with a minimal new branch + test.

## When Unsure

Ask: “Can this logic live in the SDK?” If yes, move it there first and add/export a pure helper; then compose in UI/API layers. Maintain zero `any` usage and keep contexts focused.

---

Provide feedback if a needed pattern isn’t covered so we can extend these instructions.

## Code Quality

- Always avoid `any` and use proper TypeScript types.
- Always remove comments.
- Always remove unused code.
- Always lint and run tests with force exit before committing.
- Use Clickup ID (branch name prefix) in commit messages.
- Classes are documented with JSDoc comments.
- Functions are documented with JSDoc comments.
- README describes the structure and technical solutions.
- No unused imports and avoid importing globally available libraries (e.g. React, Jest) unless needed.
