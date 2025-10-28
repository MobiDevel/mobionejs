## Change Summary (mobione-sdk)

Short, specific description of what changed and why. Mention if it fixes a bug, adds a model, modifies validation, or adjusts build tooling.

## Related ClickUp Issue

- Task: [CU-XXXXXXXX](https://app.clickup.com/t/XXXXXXXX)

## Type of Change

- [ ] Feature (new model / util / export)
- [ ] Bug fix
- [ ] Refactor / Internal cleanup
- [ ] Performance / Bundle size
- [ ] Tooling / Build / CI
- [ ] Docs only
- [ ] BREAKING CHANGE

## API Surface Changes

List added / changed / removed exports, types, schemas.

| Export / Type      | Change            | Notes / Migration            |
| ------------------ | ----------------- | ---------------------------- |
| e.g. `CMoTVehicle` | Added field `foo` | Optional; no breaking impact |

If breaking:

- Migration steps: (bullet list)

## Backward Compatibility

- [ ] Fully backward compatible
- [ ] Requires minor code changes (document above)
- [ ] Breaking (major) – justify why

## How to Test Locally

1. Install deps: `npm i`
2. Build: `npm run build` (or watch: `npm run start`)
3. Run tests: `npm run test:dev`
4. (Optional) Pack + consume in target project:
   - `npm pack` -> note produced tarball
   - In consumer project: `npm i /absolute/path/to/mobione-sdk/<file>.tgz`
5. Verify usage with a small import snippet:
   ```ts
   import {} from /* changed export */ '@mobidevel/mobione-sdk';
   ```
6. (If schema change) Validate parsing & zod schema generation still works.

### Test Checklist / Acceptance Criteria

- [ ] Covers ClickUp task use case and edge cases
- [ ] Core happy path(s):
  - [ ] <Step 1>
  - [ ] <Step 2>
  - [ ] <Step 3>
- [ ] New / changed validators behave as expected (valid + invalid samples)
- [ ] No regressions in adjacent models / utils
- [ ] Error scenarios handled (invalid uuid, missing required fields, etc.)
- [ ] Type definitions compile (no new TS errors in consumer)

## Quality & Tooling Checklist

- [ ] Lint passes (`npm run lint`)
- [ ] Tests added / updated
- [ ] All tests green locally
- [ ] Bundle size within limit (`npm run size`) – note delta below
- [ ] README / docs updated (if user-facing)
- [ ] Version bump planned (see next section)

## Bundle Size Impact (optional but encouraged)

| Metric          | Before | After | Δ   |
| --------------- | ------ | ----- | --- |
| `dist/index.js` | KB     | KB    | KB  |

Notes: (e.g. acceptable increase due to new feature / reduced by refactor)

## Versioning Plan

Intended bump: [ ] patch [ ] minor [ ] major

Run `npm run version:next` only when ready to tag & release. If not yet bumped, explain when it will happen.

## Risks & Rollback

Risks: Briefly list (e.g. parsing edge cases, downstream schema generation, consumers relying on removed field).

Rollback: Revert merge commit OR publish previous version. No data migration expected unless noted.

## Additional Context

- Related libs / consumers affected:
- Any new dev dependency?
- Any change to peerDependencies?
- Feature flags (if any):

## Screenshots / Code Snippets (optional)

Add schema diffs, sample object before/after, or failing test reproduction if helpful.

## Release Notes (optional)

Short user-facing summary (will be included in GitHub Release if applicable).

## Changelog Entry (optional)

`- feat: <something>` / `- fix: <something>` / `- refactor: <something>`
