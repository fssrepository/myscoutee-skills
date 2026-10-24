# Pattern: reuse behavior, not duplicated markup

Status: candidate UI habit derived from repeated MyScoutee work.

When a new flow should be “similar to” an established one—such as asset borrow
versus event checkout—first decompose the reference:

```text
shared interaction grammar
shared domain-capable component
shared pricing/policy/payment concepts
flow-specific fields and limits
flow-specific command and audit semantics
```

## Questions

1. Which existing component can support a deliberate view/read-only mode?
2. Which store/service behavior is truly shared?
3. Which domain differences forbid direct cloning?
4. Are step order, summary, payment demo, back/continue actions, badges, and
   member states consistent where the user expects parity?
5. Does local and HTTP behavior remain equivalent?
6. Are committed audit values displayed after payment rather than recalculated
   from current pricing?

Do not create a near-copy and later patch divergence. Do not force unrelated
flows into a generic abstraction before the shared contract is explicit.

