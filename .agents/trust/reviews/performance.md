# Review: performance

## Establish the measurement

- [ ] The actual target environment/profile is identified.
- [ ] The stack is healthy and not duplicated.
- [ ] Debug/optimized build differences are recorded.
- [ ] Dataset, concurrency, cache state, network/CPU throttle, and host resources
  are known.
- [ ] A baseline uses the same scenario and thresholds as the candidate.

## Root-cause questions

1. Is latency download/transfer, server response, query/projection, browser
   scripting, rendering, polling, artificial delay, or harness overhead?
2. Is the UI waiting for work it does not need for first useful paint?
3. Is a menu badge causing repeated child projections that belong on mutation?
4. Is a route fetching duplicate or serial data already owned by a store?
5. Is the measured request accidentally using local artificial delay?
6. Is cache/compression/source-map behavior representative of the claim?

## Change discipline

- Do not change UI behavior, permissions, or data correctness to improve a
  benchmark.
- Do not remove scrolling/content or reduce accessibility merely to satisfy a
  metric.
- Do not introduce unbounded caches, polling, concurrency, or memory use.
- Optimize the proven bottleneck and preserve failure semantics.

## Evidence

Report before/after scenario, percentiles or relevant Web Vitals, transfer
bytes, errors, host/container resources, and correctness assertions. A faster
incorrect query is a failure.

