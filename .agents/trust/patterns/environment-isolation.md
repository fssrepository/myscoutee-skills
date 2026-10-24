# Pattern: environment isolation

Status: canonical boundary.

## State separation

```text
browser local: memory + scoped IndexedDB
dev HTTP:      Java + demo_db
E2E:           Java + independent e2e_db
production:    Java + production DB
prod Explore:  Java + demo_db + isolated internal demo Registry
real Registry: explicitly selected external service
```

## Habit questions

1. Which mode is the user actually running?
2. Which frontend environment replacement is compiled?
3. Which adapter serves the route?
4. Which Mongo database and seed directory are active?
5. Which Registry URL, scope, identity, state directory, and volume are active?
6. Can any test/demo action touch production or real Registry state?
7. Will reset/rebuild/import reproduce the claimed fix?

Separate clones may intentionally share schema but must not share mutable state.
Do not collapse them with symlinks or convenient fallback routing.

