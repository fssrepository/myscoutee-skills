# Review: completion evidence

Answer these questions before calling work complete. Use paths, commands, and
observations; do not answer only “yes”.

## Scope

1. What exact user outcome is now achieved?
2. Which queued additions were completed, deferred, or superseded?
3. Which files changed in the parent, frontend submodule, and sibling Registry?
4. Did any file fall outside the predicted scope? Why?
5. Were all pre-existing user changes preserved?

## Behavior

6. What behavior changed from before to after?
7. Did any fallback, repair path, default, filtering, permission, timing,
   persistence, or environment selection change?
8. What related behavior was intentionally preserved?
9. Is the fix in the owning layer, and what evidence identifies that owner?
10. Does save/reload, mutation/read, retry/restart, or local/HTTP parity matter,
    and was it proven?

## Architecture and trust

11. Which constitutional boundaries were touched?
12. Which approved/candidate reference was followed, and only for what aspect?
13. Did private data, keys, identities, audit history, or privilege boundaries
    change?
14. If cross-repository, were both real implementations tested together?

## Verification

15. Which exact checks passed?
16. Which checks failed or were not run?
17. What does the evidence not prove?
18. Are any agent-started processes still running or disposable data mutated?
19. Did the efficiency scan find any query/storage/network/filesystem call in
    iteration, repeated state hydration, avoidable projection, or missing
    batching? What changed or why is the work necessarily per item and bounded?
20. Is the final diff reviewable and free of unrelated churn?
21. Did this task expose a reusable correction that belongs in learnings?

## Final report minimum

```text
Outcome:
Behavior delta:
Files/areas changed:
Verification:
Not run / not proven:
Remaining risks or follow-up:
```
