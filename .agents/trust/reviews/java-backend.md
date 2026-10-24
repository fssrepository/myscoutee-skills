# Review: Java backend

## Responsibility path

Trace the applicable flow:

```text
controller/auth -> request DTO/validation -> service/domain mutation
-> mapper -> repository/persistence -> response DTO
```

External Registry paths also include durable local intent, canonical signing,
bounded HTTP, receipt verification, and persisted evidence.

## Questions

- [ ] Does the controller remain thin and enforce the correct authority?
- [ ] Is business behavior in the owning service rather than controller or
  mapper?
- [ ] Is persistence access in a repository/local-store boundary?
- [ ] Are DTO and domain/document shapes mapped explicitly?
- [ ] Are actor identity and permissions derived from authenticated scoped
  identity rather than caller-supplied IDs?
- [ ] Are mutation invariants and dependent counters/projections updated
  atomically or durably?
- [ ] Does the change preserve idempotency, retry, and restart behavior?
- [ ] Does it avoid repairing demo/E2E seed data in production application
  services?
- [ ] Does absence remain distinct from empty/cleared values?
- [ ] Are logs free of secrets, tokens, raw identifiers, and sensitive payloads?

## Behavior-change gate

Java must not be changed merely because:

- a fixture is inconsistent;
- a UI test assumes obsolete behavior;
- the local frontend adapter differs internally;
- an old commit contained a repair/fallback;
- a broad E2E run failed for environment reasons.

Require a proven Java-owned defect or an explicit requested redesign.

## Proof

Run focused service/repository/controller tests as appropriate, then the
relevant HTTP/E2E path when serialization, persistence, auth, or cross-layer
behavior changed.

