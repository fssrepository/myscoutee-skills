# Risk model

## Tier 0 — observation

Read-only diagnosis, inventory, explanation, or status reporting. No product or
external state changes.

Expected evidence: inspected files/commands and explicit uncertainty.

## Tier 1 — local and narrow

Documentation, isolated test, mechanical rename, or implementation correction
with no intended behavior change and a small owning surface.

Expected evidence: focused diff plus focused validation.

## Tier 2 — behavior or shared contract

User-visible behavior, shared frontend store/service, Java service/repository,
schema-shaped data, counter/projection, cross-route policy, or environment
change.

Expected evidence: behavior delta, regression proof, owning-layer test, and at
least one realistic workflow. Avoid unrelated edits.

## Tier 3 — trust, durability, or deployment

Authentication, authorization, private keys, Registry protocol, accounting,
payments, update workers, backup/restore, packaging, database migration, or
destructive state transition.

Expected evidence: canonical source review, failure-path analysis, exact
artifact/state boundaries, focused and broad verification, and explicit
residual risk. Do not infer permission for external or destructive actions.

## Escalation conditions

Increase the tier when:

- the edit crosses repository, process, persistence, or privilege boundaries;
- failure can silently corrupt state or weaken security;
- rollback is difficult or accepted history is immutable;
- the environment being tested differs from the environment being claimed;
- the proposed fix introduces a fallback, repair path, migration, or derived
  state not already part of the proven contract.

