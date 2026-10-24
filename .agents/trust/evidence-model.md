# Evidence model

Trust claims require concrete evidence. The goal is not more testing by
default; it is matching evidence to the actual contract and risk.

## Evidence ladder

From weakest to strongest:

1. Code inspection or static reasoning.
2. Existing focused unit test.
3. New or updated regression test that fails before and passes after.
4. Focused integration test across the owning layers.
5. Real save/reload, mutation/read, retry/restart, or local/HTTP workflow.
6. Full relevant suite against the intended environment.
7. Exact immutable artifact, installed-host, upgrade, restore, load, or
   security evidence.

Use the lowest level that actually proves the claim, then add higher levels as
the blast radius demands. Do not call a source build a release qualification.

## Required evidence fields

For each material claim record:

```text
Claim:
Evidence command or inspected path:
Observed result:
Environment/data source:
What this does not prove:
```

## Failure classification

Before changing product behavior, classify a failure as one or more of:

- current product logic;
- stale or inconsistent persisted data;
- canonical seed/fixture;
- local adapter;
- HTTP adapter or wire mapping;
- backend controller/service/repository;
- environment/configuration;
- test expectation;
- harness/runner;
- unavailable or unhealthy runtime;
- performance threshold or measurement method.

Evidence must distinguish these. A red test is an observation, not the
classification.

## Honest completion

Use exact status terms:

- `PASS`: the named check ran and met its assertion.
- `FAIL`: the named check ran and failed; include the first useful failure.
- `NOT RUN`: intentionally not executed; say why.
- `BLOCKED`: could not execute because of a concrete external condition.
- `NOT PROVEN`: supporting checks passed but the stated end-to-end claim was
  not exercised.
