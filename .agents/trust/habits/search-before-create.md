# Habit: search before creating

## Trigger

Before creating a service, repository, mapper, store, component framework,
retry mechanism, cache, delay, worker, DTO family, seed path, or test runner.

## Required questions

1. Which two existing implementations are structurally closest?
2. Which one is listed as approved or candidate in the pattern catalog?
3. Does an existing owner already provide the needed behavior?
4. Is the apparent duplication actually an environment/transport boundary that
   should remain separate?
5. Would extending an existing abstraction enlarge it beyond one coherent
   responsibility?

## Evidence

Record paths and what was reused:

```text
Reference 1:
Reference 2:
Existing extension point:
Reason a new abstraction is still necessary:
```

## Frequency warning

The frontend began as a large AI-generated codebase and was partially
refactored. A frequent pattern may be technical debt. Prefer, in order:

1. canonical documented boundary;
2. approved reference;
3. well-tested current implementation consistent with the boundary;
4. candidate reference requiring explicit review;
5. raw repository frequency.

Do not copy an approved reference wholesale. Approval may cover only its layer
ownership, not every internal detail.

