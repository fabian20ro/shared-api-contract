# Compatibility policy

## Version axes

- Release version: semantic tag such as v1.0.0 for documentation/schema publication.
- contractVersion: integer ABI boundary carried by module.json.

Backward-compatible documentation and validation improvements may publish a new v1.x.y release while contractVersion remains 1.

A change that requires existing modules to change their handler ABI, manifest shape or behavior increments contractVersion and publishes a new major release.

## Consumer rules

- Pin an immutable release tag in $schema.
- Declare contractVersion explicitly.
- Keep package dependencies locally locked.
- Do not depend on undocumented host behavior.
- Do not import code from this repository at runtime.

## Host rules

- Validate the manifest using the canonical private schema.
- Verify the pinned public schema digest.
- Support only explicitly declared contractVersion values.
- Reject unknown manifest fields.
- Never infer compatibility from a mutable branch.

## Deprecation

A contract major remains documented while any production release still consumes it. Removal requires a migration plan, a replacement release and confirmation that no locked service uses the old version.
