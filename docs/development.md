## Development

Build (watch): `npm run start`

One‑off build: `npm run build`

Tests: `npm run test:dev` (fast) / `npm test` (CI)

Lint + format: `npm run lint`

Minify bundle check: `npm run minify`

Size analysis: `npm run size` / `npm run analyze`

Local pack & consume:

1. `npm run build`
2. `npm pack` → tarball
3. `npm i ../path/mobidevel-mobione-sdk-<ver>.tgz` in target project

### Project Layout

`src/<domain>` folders with: `<Domain>.schema|factories|mutations|status` (+ util where needed). Transitional `CMoT*` files re‑export and are deprecated.

### Git Hooks (Husky)

Automated quality gates run locally:

| Hook       | Actions                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| pre-commit | test:dev, lint (with formatting), docs:toc (README TOC refresh), build (type check), legacy import guard |
| commit-msg | Ensures first line contains a ClickUp ID pattern `CU-xxxxx`                                              |
| pre-push   | `verify:strict` (clean + lint + tests + build + exports + legacy imports)                                |

If needed (emergency only) you can bypass with `--no-verify`, but fixes are strongly preferred.

### Commit Message Format

We use Conventional Commits + ClickUp ID:

`type(scope): short description CU-<taskId>`

Examples:

```
feat(order): add bulk status updater CU-1ab2c3
fix(timestamp): handle DST edge case CU-9xy8z7
chore: update dependencies CU-55ff44
```

Types: feat | fix | refactor | docs | test | chore | perf | build | ci | revert

The first line is validated by the commit-msg hook.

### Changelog

Generated with `conventional-changelog`.

Commands:
| Script | Purpose |
| ------ | ------- |
| `npm run changelog:generate` | Update `CHANGELOG.md` in place (no commit) |
| `npm run changelog:release` | Generate & commit changelog (if changed) |
| `npm run release:minor` | Bump minor + regenerate + commit |
| `npm run release:major` | Bump major + regenerate + commit |

Always run a changelog generation prior to tagging a minor/major release.
