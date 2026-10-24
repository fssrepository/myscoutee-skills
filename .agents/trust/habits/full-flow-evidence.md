# Habit: prove the complete behavior path

## Trigger

Persistence, mapping, mutation, cache, counter, polling, retry, local/HTTP,
frontend/backend, Java/Go, package/runtime, or restart-sensitive changes.

## Select the applicable loop

### Save loop

```text
form state -> request DTO -> HTTP mapping -> Java DTO/service -> persistence
-> read/query mapping -> HTTP response -> store -> reopened form
```

Verify create, update, explicit clearing/removal, and reload where relevant.

### Mutation/read loop

```text
authorized command -> durable mutation -> dependent status/counter/audit update
-> immediate query/poll -> UI bucket/badge/detail consistency
```

Verify both the changed record and parent/child derived state.

### Local/HTTP parity loop

```text
same user action -> local adapter result
same user action -> HTTP/Java result
compare observable semantics, not internal storage shape
```

### Durable external loop

```text
persist intent -> sign/send -> timeout/lost response -> retry/idempotency
-> verify receipt -> persist terminal evidence -> restart/reconcile
```

### Packaging loop

```text
source -> built artifact -> packaged artifact -> installed runtime identity
-> health/behavior -> upgrade/restore evidence
```

## Questions

1. What is the authoritative write?
2. What reads or projections must change in the same transaction/workflow?
3. What happens after reload, restart, retry, or late poll?
4. Does an empty/null/deleted value survive the round trip?
5. Does the proof exercise both sides of the boundary that changed?

