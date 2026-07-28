# Changelog

## v2.0.0 — 2026-07-29

- Replaced the Node-only runtime declaration with `web-fetch-v1`.
- Added explicit `node-24` and `web-worker` profiles.
- Added portable capability and external-dependency declarations.
- Kept provider configuration outside public manifests.

## v1.0.1 — 2026-07-29

- Corrected the schema $id to the immutable public raw URL.
- Removed the final schema-level reference to the private control-plane repository.
- Updated documentation and examples to pin v1.0.1; v1.0.0 remains immutable and available.

## v1.0.0 — 2026-07-29

Initial public contract:

- Web Request → Response handler factory ABI;
- module manifest schema version 1;
- Node 24 runtime declaration;
- logical route/config contract;
- JSON and binary response modes;
- provider-neutral module authoring rules;
- Alt STB and Propoziții examples;
- immutable-tag and compatibility policy.
