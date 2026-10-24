# Review: counters, buckets, projections, and derived state

## Design decision

State explicitly whether the value is:

- calculated on every query;
- maintained on mutation in a parent/read model;
- asynchronously projected;
- display-only and safe to recompute;
- immutable audit history;
- a cache that may be stale with a defined reconciliation policy.

Do not drift between these models as an incidental bug fix.

## Questions

- [ ] What is the authoritative source?
- [ ] Which mutations increment, decrement, move, suppress, restore, or remove
  the derived value?
- [ ] Are parent and child updates atomic or durably reconciled?
- [ ] Are accepted/declined/pending/trash states mutually consistent?
- [ ] Does the list membership match its badge/count immediately after write?
- [ ] Does polling/reload converge without opening a detail popup as a hidden
  refresh trigger?
- [ ] Are query-time projections bounded and justified?
- [ ] Can retries double-apply a counter?
- [ ] Can restore resurrect children that were independently deleted, or fail
  to restore children suppressed only by parent state?
- [ ] Is historical/audit price or status shown from committed evidence rather
  than recalculated from current rules?

## Existing MyScoutee preference

For high-frequency menu badges and event/resource buckets, prefer mutation-time
maintenance of compact parent/read-model state when that is the established
design, rather than repeatedly projecting many child collections on query.
This is not blanket permission to denormalize: define ownership, transaction,
idempotency, cleanup, and test coverage first.

## Proof matrix

Exercise create, approve, decline, leave/remove, delete/trash, restore,
quantity/status change, retry, and reload for every affected derived field.

