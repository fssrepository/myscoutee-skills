# Maintaining the trust library

## Change categories

- `accepted invariant`: stable project identity or boundary backed by a
  canonical source or repeated explicit decision.
- `approved pattern`: a concrete implementation approved as a responsibility
  reference; not necessarily a copy template.
- `candidate`: plausible learning or reference awaiting real-task validation.
- `rejected pattern`: a demonstrated failure mode that should trigger review.
- `historical note`: context only; never a rule by itself.

## Promotion rules

Promote a candidate when at least one is true:

- it is directly backed by a canonical architecture/trust/operations source;
- the user explicitly establishes it as a durable rule;
- the same correction recurs in independent tasks and the generalized wording
  survives review;
- a severe security, privacy, data-loss, or trust-boundary failure justifies an
  immediate guardrail.

Do not promote:

- a workaround tied to one broken environment;
- a preference inferred only from one ambiguous comment;
- a rule that merely describes the most frequent code shape;
- raw emotional language or private conversation content.

## Editing discipline

- Keep canonical project detail in its owning document and link to it here.
- Write questions that demand evidence, not slogans or yes/no confirmation.
- Include triggers and exceptions so cards do not run on every task.
- Merge duplicate rules and delete obsolete ones; more text does not create
  more trust.
- Keep `kernel.md` compact. Details belong in routed cards; do not duplicate a
  full checklist in `AGENTS.md`, the kernel, and a review card.
- A `standard` task should normally load the kernel plus one to three routed
  cards. If a rule is not broadly useful, do not add it to the kernel.
- When a code reference moves, update the catalog in the same change.
- Run `../myscoutee-skills/tools/trust/validate-trust-library.sh` after library changes.

## Performance and local modes

- The repository default is `standard`; no committed mode-state file is
  required.
- `.trust-mode.local` is a gitignored machine-local override. Valid
  values are `off`, `light`, `standard`, and `deep`.
- Use `../myscoutee-skills/tools/trust/trust-mode.sh off` to disable trust loading locally and
  `../myscoutee-skills/tools/trust/trust-mode.sh default` to restore the repository default.
- A current explicit user instruction overrides the local file for that task.
- `off` disables this project library only. It cannot disable system/developer
  instructions or broaden the user's authorization.

## Model regression evals

- Keep behavioral instructions in `.agents/trust` and their black-box
  regression cases in `tools/trust/suite`; the model must not load its expected
  answers during normal tasks.
- Run `node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --validate` after case edits. A live model
  run always names the candidate with `--model` and stores raw artifacts only
  under `.e2e-artifacts/trust-evals/`.
- Prefer semantic assertions and required decision questions over exact output
  snapshots. Preserve raw responses for human review.
- Compare candidate and baseline with the same repository commit, trust mode,
  cases, repetition count, and isolation flags.
- Fix the smallest owning trust rule, then rerun focused failures and the full
  suite. Do not leak case wording into the kernel or weaken the rubric to make a
  candidate pass.
- Accepted baseline reports may be committed under `tools/trust/suite/baselines` only
  after human review. Model output is evidence, not authority to redefine the
  expected behavior.

## Review cadence

After five to ten real tasks, review:

- which cards prevented an error;
- which questions were skipped or rubber-stamped;
- which routing loaded irrelevant context;
- which user correction was not captured;
- which accepted rule conflicts with current code or docs;
- whether any candidate is ready to promote or reject.
