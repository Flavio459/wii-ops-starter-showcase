# Security

This repository contains no operational credentials and performs no external action.

## Public-demo rules

- all tasks are synthetic;
- no provider keys or model endpoints;
- no production runner identifiers;
- no customer/project data;
- no standing authorization records;
- no deployment credentials;
- no private network addresses;
- no operational memory.

## Fail-closed behavior

The public logic intentionally refuses silent execution when:

- preflight is incomplete;
- scope is unclear;
- required authorization is absent;
- a protected external effect is requested;
- risk is unknown;
- closure evidence is missing.

This is a demonstration pattern, not a complete security framework.
