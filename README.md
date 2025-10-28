<!-- TOC-START -->

### Documentation

- [development](/docs/development.md)

### Main Sections

  - [Documentation](#documentation)
  - [Main Sections](#main-sections)
- [Motivation](#motivation)
- [Install](#install)
- [Usage](#usage)
  - [Domain modules](#domain-modules)
  - [Type safety](#type-safety)
- [API coverage](#api-coverage)
- [Project layout](#project-layout)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
<!-- TOC-END -->

# mobionejs

JavaScript / TypeScript models and helpers for integrating with the public **MobiOne** transportation and temperature APIs. This package powers both server-side tooling and React applications that need typed access to the same underlying data structures.

## Table of Contents
- [Motivation](#motivation)
- [Install](#install)
- [Usage](#usage)
  - [Domain modules](#domain-modules)
  - [Type safety](#type-safety)
- [API coverage](#api-coverage)
- [Project layout](#project-layout)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Motivation

MobiOne exposes a REST API for capturing vehicle plans, temperature traces, orders, visits, and more. Historically, implementations duplicated DTOs and validation logic across back-end and front-end repos. `mobionejs` centralises those models so every consumer uses the same types, schemas, factories, and utilities—reducing drift and keeping API contracts consistent.

Key goals:
- Deliver first-class TypeScript support (declarations ship alongside CJS/ESM builds).
- Provide runtime validation via Zod schemas that mirrors the public API contracts.
- Offer helpers for composing requests/responses when talking to the MobiOne API directly.

## Install

```bash
npm install mobionejs
# or
yarn add mobionejs
# or
pnpm add mobionejs
```

The package targets Node.js 18+ and modern bundlers. Both ESM (`dist/*.mjs`) and CommonJS (`dist/*.cjs`) builds are published with identical exports.

## Usage

```ts
import { VehiclePlanFactory } from 'mobionejs/vehicle/factories';
import type { PlanUpdateRequest } from 'mobionejs/plan';

const payload: PlanUpdateRequest = VehiclePlanFactory.build({
  organisationId: 'org_123',
  vehicleId: 'veh_456',
  date: '2025-01-14',
});

// Send the payload straight to the public API:
await fetch(`${API_BASE_URL}/plan`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(payload),
});
```

### Domain modules

Every domain (load, order, visit, vehicle, etc.) is available as a standalone subpath export so you only pull in what you need. Examples:

- `mobionejs/order/schema` – Zod schemas and validators for order payloads.
- `mobionejs/load/factories` – Factory helpers for composing load DTOs.
- `mobionejs/temp/utils` – Utilities for temperature probe readings.

Because we publish subpath exports under `./<domain>/*`, bundlers can tree-shake unused code paths and you can opt into specific models without importing the entire package.

### Type safety

Each domain exposes `.schema.ts` files built with Zod. They act as runtime guards and also infer TypeScript types. For instance:

```ts
import { CustomerSchema } from 'mobionejs/customer/schema';

const parsed = CustomerSchema.parse(input);
// parsed is fully typed and safe to forward to API clients
```

Whenever the public API introduces new fields or deprecates existing ones, the corresponding schema and generated types will be updated here first.

## API coverage

The SDK focuses on data structures. You are expected to call the REST endpoints yourself (using `fetch`, Axios, etc.). The package ships:

- Request & response DTOs for REST endpoints.
- Enumerations and constants used in API payloads.
- Conversion utilities (e.g. helpers that map API responses into UI-friendly shapes).
- Transitional `CMoT*` modules for backwards compatibility—new code should target the namespace exports shown above.

If a public API resource is missing, open an issue or PR so we can add the schema and helpers.

## Project layout

- `src/<domain>/` – Domain-specific models, factories, schemas, utilities.
- `src/internal/` – Implementation details not exported publicly.
- `dist/` – Generated artifacts (CJS/ESM bundles + `.d.ts` files via `tsup`).
- `scripts/` – Local tooling (export guards, changelog checks, release helpers).

## Scripts

Commonly used npm scripts:

- `npm run build` – Clean + compile with `tsup` (generates CJS/ESM + types).
- `npm run test:dev` – Jest in watch mode (reused from the private SDK).
- `npm run verify` – Full quality gate (lint, tests, build, export checks, size-limit).
- `npm run size` – Inspect bundle size; pairs with `npm run analyze` for visualisation.
- `npm run minify` – Produces a minified reference bundle for quick spot checks.

See `docs/development.md` for the complete workflow and release commands.

## Contributing

We welcome fixes and feature additions! Please:

1. Read `docs/development.md` for guidance on local development.
2. Adhere to Conventional Commits with ClickUp IDs (`type(scope): message CU-xxxxx`).
3. Run `npm run verify:strict` before submitting a PR—CI enforces the same checks.

## License

ISC © MobiDevel AB
