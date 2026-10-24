# Habit: diagnose before changing behavior

## Trigger

Any bug, failing test, performance regression, inconsistent counter, missing
record, environment mismatch, or request containing “fix the root cause”.

## Required diagnosis record

```text
Observed behavior:
Expected behavior:
Environment and data source:
Reproduction/evidence:
Last known correct boundary:
First proven incorrect boundary:
Competing hypotheses:
```

## Evidence order

1. Verify the actual running environment and URL.
2. Reproduce or inspect the current failure without editing.
3. Trace the relevant value from authoritative mutation through persistence,
   mapping, query/store, and presentation.
4. Compare local and HTTP behavior when one works and the other does not.
5. Inspect canonical seed/fixture data and existing persisted state separately.
6. Inspect tests and harness assumptions.
7. Inspect Git history to learn why current behavior exists or was removed.
8. Only then select the smallest owning layer to change.

## Classification questions

- Is current persisted data inconsistent while new mutations are correct?
- Is the canonical seed itself wrong, meaning a live edit would only mask the
  next reset?
- Is the frontend local adapter correct while HTTP mapping or Java persistence
  loses a field?
- Does a reload/restart lose data that an in-memory view temporarily shows?
- Is the test asserting an old or intentionally removed contract?
- Is the runner measuring a dead stack, debug build, uncompressed asset, or
  wrong profile?
- Is a slow query doing query-time projection for a value intended to be
  maintained on mutation?

## Prohibited shortcuts

- Do not catch an error and return alternate data merely to make the screen or
  test continue.
- Do not add repair-on-read or repair-on-write application behavior for malformed
  demo/E2E fixtures.
- Do not restore code from history solely because tests passed with it before.
- Do not modify Java when the only proven defect is seed data; do not modify
  seed data when new production mutations are proven wrong.
- Do not “fix” a performance measurement until the measurement environment is
  proven representative.

## Exit condition

Behavior-affecting edits may begin when the first incorrect boundary and its
owner are supported by concrete evidence, or when the user explicitly asks for
a deliberate behavior redesign.

