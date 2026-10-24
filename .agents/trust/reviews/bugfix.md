# Review: bug fix

## Before editing

- [ ] The failure is reproduced or supported by a concrete current-state
  observation.
- [ ] Expected behavior comes from the current user request, canonical source,
  or a proven working equivalent—not only an old test or commit.
- [ ] The environment, user/role, route mode, and data source are identified.
- [ ] The first incorrect boundary is known.
- [ ] Product logic, persisted data, canonical seed, test expectation, harness,
  and runtime health have been considered separately.
- [ ] Relevant removal/history was inspected without assuming restoration.

## Fix-shape questions

1. Does the edit repair the owner or compensate elsewhere?
2. Does it add a fallback, catch-and-continue path, repair behavior, default, or
   alternate data source?
3. Does it alter unrelated behavior that was working before the investigation?
4. Is a refactor being justified only by proximity to the bug?
5. Will the same issue recur after seed reset, reload, restart, or a different
   adapter?

Any “yes” to questions 2–4 requires explicit evidence and scope justification.

## Required proof

- focused before/after regression evidence;
- the actual failing boundary exercised;
- save/reload or mutation/read proof if stateful;
- local/HTTP comparison if one side was the reference;
- exact remaining failures and non-goals.

