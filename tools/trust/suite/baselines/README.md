# Accepted trust-eval baselines

This directory belongs to the executable suite under `tools/trust/suite`.

Store only reviewed `*.report.json` files here. Raw responses, JSONL events,
stderr, authentication material, and temporary candidate reports belong under
the gitignored `.e2e-artifacts/trust-evals/` directory.

A baseline records observed behavior for comparison; it does not redefine the
expected behavior in `cases/*.json`. Promote a report only when:

- every included case and repetition was reviewed;
- the repository/trust changes that produced it are understood;
- no assertion was weakened merely to accept the candidate output;
- model, CLI version, repository commit/dirty state, and repeat count are
  retained in the report;
- the report contains no local absolute paths or raw model content.
