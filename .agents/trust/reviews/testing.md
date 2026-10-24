# Review: tests and harnesses

## Establish the contract

- [ ] The test names the behavior it proves rather than implementation detail.
- [ ] The expectation matches the current contract, not an accidentally stale
  snapshot or historical behavior.
- [ ] The test uses the intended adapter, profile, database, role, and route.
- [ ] Mutating tests use disposable state and define reset/isolation behavior.
- [ ] A harness failure is diagnosed independently from a product failure.

## Test-fix questions

1. Would the proposed product change be desirable without this failing test?
2. Does the fixture represent a state production code is required to accept?
3. Is data malformed because the canonical seed is wrong?
4. Is the runner calling a renamed/removed profile, route, flag, or database?
5. Is a timeout hiding a dead stack, wrong TLS, artificial delay, or missing
   readiness check?
6. Does the test verify the mutation and the subsequent read/reload, or merely
   an HTTP status?

## Suite ladder

1. syntax/static check when relevant;
2. focused unit or case;
3. owning module/suite;
4. relevant HTTP/UI E2E;
5. stress/load only for a defined performance contract;
6. full suite only when required by blast radius or explicit request.

Record exact commands, environment variables that affect semantics, pass/fail
counts, first relevant failure, skipped cases, and any process left running.

## Prohibitions

- Do not loosen assertions to accept both correct and incorrect behavior.
- Do not add product fallbacks for fixtures.
- Do not treat a browser screenshot as proof of persisted state.
- Do not claim a full pass when only a filtered suite ran.

