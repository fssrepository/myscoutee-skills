# MyScoutee agent instructions

Scope: this repository, its `frontend` submodule and work crossing into the
sibling `myscoutee-registry` repository. Global focus, continuation and reuse
rules apply. An in-scope defect report authorizes diagnosis, repair and
verification, followed by the remaining work; respect diagnosis-only/no-edit
instructions.

Read and apply [shared development rules](../myscoutee-development.md) before
engineering work. For application QA, also read [manual QA rules](../manual-qa.md).

## Higgsfield production route

For MyScoutee Higgsfield/Cinema Studio work or continuation, enter through the
[Higgsfield skill](../../.agents/skills/myscoutee-higgsfield/SKILL.md). It routes production
continuity and historical decisions separately from application manual QA.

## Optional manual-QA continuation route

Only an explicit request to continue/resume the campaign activates this route.
Read `tests/qa/README.md`, then only the requested case under
`tests/qa/categories/`. The current baseline is closed; documentation cleanup
does not resume it. Keep case results in the existing QA matrix, without a
separate handoff or history ledger. If the runtime boundary may be stale,
verify it read-only before fixture mutation, browser relaunch or replay.
