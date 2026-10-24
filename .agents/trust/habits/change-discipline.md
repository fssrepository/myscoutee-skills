# Habit: make the smallest coherent change

## Trigger

Before the first edit and whenever the proposed file list expands.

## Change contract

Write or hold this statement:

```text
I will change <owner> so that <observable contract> changes from <before> to
<after>. I will not change <adjacent behavior>. The proof will be <evidence>.
```

## Rules

- Change the owning layer, not the easiest layer to patch.
- Preserve intentional behavior not named by the request.
- Do not combine a focused fix with cleanup, architectural refactoring, or
  formatting churn.
- Add an abstraction only when it matches an approved local responsibility or
  removes demonstrated repeated complexity.
- Prefer structured parsing/mapping APIs over string surgery.
- Preserve existing IDs, ordering, status semantics, and audit history unless
  the task explicitly changes them.
- Treat null, missing, empty, deleted, and default values as different contract
  states when save/reload behavior depends on them.
- Make error and retry behavior explicit. Do not turn a failure into plausible
  stale success.

## No silent behavior change

A behavior change includes more than UI text. It includes:

- adding/removing/filtering records;
- changing defaults, fallbacks, time windows, ordering, permissions, counters,
  retries, persistence, or cleanup;
- changing which environment/data source serves a route;
- materializing or deriving state at a different time;
- accepting previously rejected input;
- making a failure non-fatal or vice versa.

If one is necessary, surface the delta in the progress update and final report.
Do not bury it in a refactor description.

## History discipline

Before restoring removed code, answer:

1. Which commit removed it?
2. Was removal deliberate, cleanup, migration, or accidental?
3. Does the current canonical contract still require it?
4. Can the failing current contract be corrected without resurrection?

History is evidence, not permission.

