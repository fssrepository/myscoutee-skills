# Review: data, fixtures, and seeds

## Identify the data class

- browser-local seed builder/state;
- `demo_db` canonical Mongo seed;
- `e2e_db` deterministic test seed;
- production-safe catalog/configuration seed;
- live disposable development data;
- real production/operator data.

Do not treat these as interchangeable.

## Questions

- [ ] Is the canonical seed wrong, the current imported database stale, or new
  mutation logic wrong?
- [ ] Will the fix survive a database/IndexedDB reset?
- [ ] Are related collections internally consistent by IDs, ownership, status,
  counts, and references?
- [ ] Are demo and E2E directories separate physical copies rather than
  symlinks/aliases?
- [ ] Does production remain empty of synthetic users/activity while retaining
  only explicitly allowed catalogs/configuration?
- [ ] Are direct identifiers, secrets, real customer data, and private keys
  absent?
- [ ] Does browser seed bootstrap keep one hydrated in-memory graph and flush
  completed steps instead of repeatedly reading IndexedDB?
- [ ] If current disposable data needs cleanup, is the canonical seed also
  corrected when appropriate?
- [ ] If only old data is inconsistent, is cleanup/migration separate from the
  forward mutation fix?

## Counter and projection data

For badges/buckets/summary fields verify:

- authoritative child mutation;
- parent counter/status change;
- immediate read after mutation;
- late poll/reload behavior;
- restore/delete/leave cascading semantics;
- cleanup of already inconsistent seeded records.

Do not add application repair behavior to normalize fixtures invisibly.

## Proof

Use structured validation (`jq`, parser, import test), focused mutation/read
tests, and reset/reimport verification when the canonical seed changed.

