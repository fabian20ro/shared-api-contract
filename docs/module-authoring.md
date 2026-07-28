# Public module authoring

This document defines how a public application repository contributes an API to shared-api-host.

Public distribution: https://github.com/fabian20ro/shared-api-contract
Current contract release: v2.0.0

Human-facing documentation may follow main. Module manifests and CI must pin an immutable release tag.

## Required folder

Add this self-contained folder at the public repository root:

~~~text
shared-api/
  module.json
  package.json
  package-lock.json
  tsconfig.json
  src/
    index.ts
    domain/
  test/
    contract.test.ts
    fixtures/
  .env.example
  README.md
~~~

The folder must build and test independently from the frontend or legacy backend.

## Entry contract

src/index.ts exports the factory named by module.json:

~~~ts
export type FetchHandler = (request: Request) => Promise<Response>;

export function createHandler(
  config: Readonly<Record<string, unknown>>,
  dependencies: {
    logger: {
      debug(message: string, fields?: Record<string, unknown>): void;
      info(message: string, fields?: Record<string, unknown>): void;
      warn(message: string, fields?: Record<string, unknown>): void;
      error(message: string, fields?: Record<string, unknown>): void;
    };
    clock: { now(): number };
    transport?: {
      fetch(request: Request): Promise<Response>;
    };
  }
): FetchHandler;
~~~

The host validates the manifest and adapts this handler to Render Node, Vercel Functions and Cloudflare Module Workers.

## Module rules

Required:

- Web-standard Request and Response boundary.
- Declare only runtime profiles actually verified by the module.
- A `web-worker` module uses no Node built-ins or global `process`.
- Deterministic import with no network/filesystem side effects.
- Configuration passed only through createHandler.
- Dependencies injected where behavior differs by provider or test.
- Clients, token caches and connection pools created in factory scope.
- Explicit route and method validation.
- Unit tests plus contract fixtures.
- Locked dependencies.
- JSON and binary response modes both supported without implicit conversion.

Forbidden:

- Reading process.env in domain code.
- Importing Vercel, Render or Cloudflare request/runtime types.
- Embedding provider project IDs or production URLs.
- Secret values, credential examples or real tokens.
- Runtime git/network module loading.
- Arbitrary build/deploy commands in module.json.
- An open catch-all proxy.

## module.json

Example:

~~~json
{
  "$schema": "https://raw.githubusercontent.com/fabian20ro/shared-api-contract/v2.0.0/schema/module.schema.json",
  "schemaVersion": 2,
  "id": "alt-stb",
  "contractVersion": 2,
  "runtime": {
    "abi": "web-fetch-v1",
    "profiles": ["node-24", "web-worker"],
    "capabilities": ["outbound-fetch", "abort-signal", "binary-response"]
  },
  "build": {
    "entry": "src/index.ts",
    "export": "createHandler",
    "output": "dist/index.js"
  },
  "routes": [
    {
      "path": "/lines/stop",
      "methods": ["GET", "OPTIONS"],
      "response": "binary"
    }
  ],
  "config": [
    {
      "name": "STB_APP_ID",
      "type": "string",
      "required": true,
      "sensitive": true
    },
    {
      "name": "STB_APP_KEY",
      "type": "string",
      "required": true,
      "sensitive": true
    },
    {
      "name": "ALLOWED_ORIGINS",
      "type": "string[]",
      "required": true,
      "sensitive": false
    }
  ],
  "contracts": {
    "fixtureDirectory": "test/fixtures"
  }
}
~~~

The manifest declares the logical API contract. Private deployment configuration chooses mount prefixes, source revisions, providers and secret bindings.

The schema URL is public and pinned to an immutable contract tag. Public repositories therefore need no access to shared-api-host and cannot silently receive breaking schema changes. The private host validates with its canonical schema and verifies the public release digest before accepting a module.

## Standard scripts

package.json provides fixed names:

~~~json
{
  "scripts": {
    "check": "tsc --noEmit",
    "test": "vitest run",
    "build": "tsc -p tsconfig.json",
    "dev": "tsx src/dev.ts"
  }
}
~~~

The private host controls which scripts run. Manifest files cannot inject commands.

## Configuration

module.json lists logical configuration names, not provider environment names.

Example mapping:

~~~text
logical STB_APP_ID
  Render: ALT_STB_APP_ID
  Vercel Alt project: STB_APP_ID
  factory config: STB_APP_ID
~~~

Sensitive names describe requirements only. Values live in private GitHub Actions secrets and provider runtime stores.

.env.example contains empty placeholders or obviously fake values. .env.local is ignored.

## Response contracts

Propoziții:

- /api/all JSON shape remains stable;
- all six fields remain strings;
- allowed HTML attributes remain synchronized with frontend sanitizer;
- multi-line verses keep literal " / ".

Alt STB:

- only explicit paths are accepted;
- upstream status and protobuf body are preserved safely;
- Content-Type is not rewritten to JSON;
- auth token refresh retries once on 412;
- errors remain classified without exposing credentials.

## Public CI

Public CI may run:

~~~text
cd shared-api
npm ci
npm run check
npm test
npm run build
~~~

It does not deploy and does not require production secrets. Live tests must be opt-in and use local developer configuration.

## Registering or updating a module

1. Select a published shared-api-contract release and pin its schema URL in module.json.
2. Add or change shared-api/ in the public repository.
3. Pass its local unit and contract tests.
4. Merge to the public default branch.
5. Choose the exact commit SHA.
6. Run the private source-update workflow manually, or wait for its scheduled discovery.
7. Review the generated sources.lock.json pull request.
8. Merge only after combined host and provider-context tests pass.
9. Promote the verified private release candidate.

A public merge alone never changes production.
