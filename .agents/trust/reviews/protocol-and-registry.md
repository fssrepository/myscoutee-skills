# Review: Registry protocol and network accounting

## Load first

- `guides/plans/PROJECT_CONTEXT.md`
- permanent boundaries in `guides/plans/OPERATOR_NETWORK_ROADMAP.md`
- sibling Registry project context/roadmap when available
- relevant Java and Go canonical signing fixtures/tests

## Boundary questions

- [ ] Does Angular still call only local Java?
- [ ] Does Java retain exclusive deployment private-key and outbound Registry
  ownership?
- [ ] Does the Registry remain independent from ordinary local product data?
- [ ] Can local product startup/work continue during Registry outage?
- [ ] Is endpoint/scope/key identity explicitly inspected and pinned?
- [ ] Does changing endpoint follow deactivation/archive/fresh registration
  rather than in-place mutation or implicit migration?

## Wire and cryptographic questions

- [ ] Are protocol version, method, path, scope, deployment ID, timestamp,
  nonce, idempotency key, payload hash, and signing domain canonicalized
  identically in Java and Go?
- [ ] Are strict JSON, unknown-field, size, token, timestamp, replay, and scope
  rules preserved?
- [ ] Are responses and receipts verified against the pinned Registry identity
  before persistence/use?
- [ ] Does an exact retry return the original result without duplicate ledger
  or weight effects?
- [ ] Are conflicting, stale, or branching revisions rejected/quarantined?
- [ ] Are accepted records append-only and corrections explicit?

## Durability questions

- [ ] Is intent durable before the network attempt?
- [ ] Does lost response, retry, Java restart, Go restart, and duplicate delivery
  converge correctly?
- [ ] Is signed evidence persisted before reporting success?
- [ ] Are local state/key/receipt files protected against unsafe paths,
  mismatch, rollback, and partial restore?

## Proof

Require shared fixtures or cross-process protocol tests for any wire/signature
change. A Java-only or Go-only unit test cannot prove interoperability.

