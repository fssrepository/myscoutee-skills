# Pattern: write-time derived state

Status: candidate pattern with accepted MyScoutee use for hot counters/buckets.

## Use when

- the value is read very frequently;
- query-time calculation crosses many child collections or is demonstrably
  expensive;
- every owning mutation can update the compact parent/read state;
- atomicity, idempotency, cleanup, and reconciliation are defined.

## Required design

```text
authoritative child mutation
  + parent counter/bucket/status update
  + immutable audit event when required
  = one atomic or durably reconcilable operation
```

## Questions

1. List every transition that affects the value.
2. How do retries avoid double increments/decrements?
3. How are delete, suppress, restore, leave, approval, decline, and reassignment
   represented?
4. How are already inconsistent old records cleaned once without adding
   permanent repair-on-read?
5. Can tests compare stored derived state to authoritative recomputation?

Do not use this pattern for immutable historical price/audit values that must be
read from the committed record rather than current rules.

