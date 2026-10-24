# Habit: ask whether the same work can cross fewer boundaries

## Trigger

Always sample non-trivial changed code, and inspect every changed:

- loop, stream, callback iteration, recursion, or per-item helper call;
- database query/projection and repository method;
- IndexedDB/localStorage access;
- HTTP/Registry/media/filesystem call;
- multi-step bootstrap, import, seed, migration, or reconciliation;
- repeated mapping, serialization, cryptography, DOM measurement, or polling.

## First question

> Can the same correct behavior be implemented with fewer database, storage,
> network, process, or other expensive boundary crossings?

Do not answer from the visible loop alone. Inspect helpers called by the loop;
a repository or IndexedDB read can be hidden several calls below it.

## Mandatory questions

1. Does iteration perform a database, IndexedDB, HTTP, filesystem, or other I/O
   operation once per item?
2. Is the same state read, parsed, mapped, projected, or serialized repeatedly?
3. Can required IDs/keys be collected first and fetched with one bounded batch
   query or aggregation?
4. Can one snapshot/in-memory graph be loaded once and passed through the
   workflow steps?
5. Can repeated lookup become an indexed `Map`/`Set` over already loaded data?
6. Is a hot derived value better maintained by the owning mutation than
   projected across child data on every query?
7. Is the database query supported by the right access pattern/index, or does
   it scan/sort far more state than the result requires?
8. Does cost grow linearly, quadratically, or as N network/storage round trips
   when dataset size grows?
9. Can writes be made as one atomic/bulk operation without losing per-item
   validation, audit, idempotency, or failure visibility?
10. If batching is not safe, is concurrency bounded and is partial progress
    explicitly handled?

## Preferred transformations

Use only when semantics remain correct:

```text
query inside loop            -> collect keys + bounded batch query + map lookup
IndexedDB read per seed step -> hydrate once + pass one in-memory graph + flush
                               completed steps
same projection per request  -> mutation-maintained compact read state when it
                               is the established owned design
one write per item           -> validated atomic/bulk write or bounded durable
                               work queue
repeated remote lookup       -> request-scoped deduplication/batching with
                               explicit freshness and failure semantics
```

The demo bootstrap rule is concrete: hydrate IndexedDB once, pass the same
in-memory state through builders/mappers/repositories, and flush completed
steps. Do not re-query IndexedDB between steps.

## Correctness guardrails

Efficiency does not authorize:

- loading an unbounded database into memory;
- bypassing pagination, authorization, tenant/deployment scope, or validation;
- using a stale global cache where request-consistent state is required;
- hiding per-item failures or returning partial success as complete;
- weakening transactions, audit evidence, retry, or idempotency;
- denormalizing state without complete mutation and reconciliation ownership;
- optimizing an unmeasured path by broad refactor.

## Evidence

For material paths, record at least one:

- before/after query or boundary-call count;
- bounded dataset and complexity reasoning;
- query plan/index evidence;
- benchmark/profile with correctness assertions;
- test proving one hydration/batch and correct final state;
- explanation why per-item I/O is required and bounded.

## Exit answer

Before completion, state either:

```text
Efficiency improvement: <repeated boundary work removed and how>
```

or:

```text
Efficiency scan: no unsafe repeated boundary work found / per-item work is
required because <reason> and bounded by <limit>.
```

