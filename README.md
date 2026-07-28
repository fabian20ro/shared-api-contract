# shared-api-contract

Public, versioned contract for API modules consumed by the private shared-api-host control plane.

Current release: **v2.0.0**
Contract ABI: **2**

## Use this repository

Public application repositories place provider-neutral code in shared-api/ and pin an immutable contract release.

~~~text
shared-api/
  module.json
  package.json
  package-lock.json
  tsconfig.json
  src/
  test/
~~~

Pin the schema:

~~~json
{
  "$schema": "https://raw.githubusercontent.com/fabian20ro/shared-api-contract/v2.0.0/schema/module.schema.json",
  "schemaVersion": 2,
  "contractVersion": 2
}
~~~

Never use the main branch raw schema URL for CI or builds. Human documentation on main shows the newest release; machine consumers pin a tag.

## Contents

- [Module authoring guide](docs/module-authoring.md)
- [JSON schema](schema/module.schema.json)
- [TypeScript ABI](types/index.d.ts)
- [Alt STB manifest example](examples/alt-stb.module.json)
- [Propoziții manifest example](examples/propozitii.module.json)
- [Compatibility policy](COMPATIBILITY.md)
- [Changelog](CHANGELOG.md)

## Maintenance

This repository is a generated public distribution. Canonical changes are authored and reviewed in the private shared-api-host project, then published as an allowlisted bundle.

Open a public issue here to propose clarification, compatibility improvements or a new contract capability. Direct commits here are not the source of truth.

No provider configuration, deployment IDs, source locks, secret inventory or secret values are published.
