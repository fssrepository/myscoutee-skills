# MyScoutee trust regression evals

This suite measures whether a Codex/model version follows the repository trust
protocol on representative MyScoutee decisions. The specification belongs here;
the trust instructions remain under `.agents/trust`, the runner lives one level
above in `tools/trust/`, and generated responses/reports go to the gitignored
`.e2e-artifacts/trust-evals/` directory.

## Why this is separate from `.agents/trust`

- The model should load the trust specification, not its own exam prompts and
  expected answers.
- Eval cases evolve under review without increasing normal task context.
- A runner/provider can change without rewriting the behavioral specification.
- Generated model output and credentials never belong in the trust library.

## Commands

Validate the case files without calling a model:

```bash
node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --validate
```

List or preview selected cases:

```bash
node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --list
node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --model <candidate-model> --dry-run
```

Run one read-only, ephemeral pass against an explicit model:

```bash
node ../myscoutee-skills/tools/trust/run-trust-evals.mjs --model <candidate-model>
```

Measure stability and compare with an accepted report:

```bash
node ../myscoutee-skills/tools/trust/run-trust-evals.mjs \
  --model <candidate-model> \
  --repeat 3 \
  --baseline ../myscoutee-skills/tools/trust/suite/baselines/<accepted-model>.report.json
```

Use `--case T001 --case T002` for a focused run. Live runs invoke `codex exec`
with `--ephemeral`, `--ignore-user-config`, `--sandbox read-only`, JSONL event
capture, and an explicit model. The runner is sequential by design so cases do
not contend for the worktree or create accidental load spikes.

Baseline comparison is strict: the Git-index input fingerprint (excluding only
accepted `*.report.json` baselines), non-baseline worktree state, repeat count,
trust-library fingerprint, runner/schema fingerprint, and each selected case
definition must match. A mismatch remains visible in the report and makes the
comparison fail instead of presenting moved goalposts as a regression or
improvement. A commit difference is reported as a warning because committing
the accepted baseline itself legitimately changes the commit; the candidate
model name is intentionally allowed to differ.

## Case contract

Each `cases/*.json` file contains:

- a stable scenario prompt that does not reveal the expected answer;
- semantic assertions expressed as alternative regular expressions;
- required questions when the trust behavior must ask the user;
- forbidden output patterns only when negation cannot make the match ambiguous;
- human review questions for nuance that deterministic matching cannot prove.

An assertion passes when any of its patterns matches. A `required_question`
assertion requires the concept to occur in an actual question or an explicit
user-choice request such as “choose,” “select,” or “tell me.” Merely announcing
a selected default does not pass. All assertions must pass in every repetition
for a strict case pass.

Do not weaken an assertion merely to make a candidate model green. If wording
variation is valid, add a semantically equivalent alternative. If expected
behavior changes, update the owning trust rule and case together with an
explicit behavior-delta review.

## Optimization loop

1. Freeze the case prompts and assertions before comparing models.
2. Run baseline and candidate with the same case set, repeat count, repository
   commit, trust mode, and CLI isolation settings.
3. Inspect deterministic failures and the saved raw response/events.
4. Fix the smallest owning kernel/card/routing rule. Do not paste expected case
   phrases into the trust prompt or move the entire case into always-loaded
   context.
5. Rerun the focused failures, then the full suite.
6. Review latency/token changes and false positives as well as pass rate.
7. Commit a new baseline only after human review; a newer model name alone does
   not authorize changing expected behavior.

## What this proves

A pass shows that the sampled model runs produced the required observable
decisions in read-only planning responses. It does not prove that a long coding
task will preserve them, that tool calls were correct, or that product tests
pass. Add fixture-worktree/action evals later for edit and tool-use behavior;
keep those isolated from the developer's live worktree.

Codex non-interactive mode documentation:
https://learn.chatgpt.com/docs/non-interactive-mode
