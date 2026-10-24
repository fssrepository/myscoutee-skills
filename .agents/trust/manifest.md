# MyScoutee trust manifest

Status: project-local continuity protocol, version 0.3
Authority: subordinate to system/developer instructions and the current user
request; stronger than agent defaults and repository frequency.

## Purpose

The trust library preserves MyScoutee's intended boundaries, useful working
context, approved patterns, and lessons from repeated failures. It is model
customization through versioned project habits, not a skill trigger, raw
conversation archive, or replacement for canonical product and operations
documents.

The compact entrypoint is [kernel.md](kernel.md). `AGENTS.md` selects
`off`, `light`, `standard`, or `deep` before loading the library. Progressive
loading is a correctness feature: instructions that consume too much context
will eventually be skimmed or skipped.

## Library map

| Area | Responsibility |
| --- | --- |
| `kernel.md` | small operating loop, single routing table, completion |
| `constitution.md` | stable product and architecture invariants |
| `routing.md`, `risk-model.md` | conditional references and risk classification |
| `evidence-model.md` | strength and honesty of completion evidence |
| `system-map.md`, `sources.md` | ownership map and canonical-source index |
| `habits/` | reusable decision behavior |
| `reviews/` | surface-specific questions and proof obligations |
| `patterns/` | curated responsibility references, not copy templates |
| `learnings/` | accepted, candidate, rejected, and provenance records |
| `templates/` | optional working records; do not fill them ritualistically |
| [higgsfield/](higgsfield/README.md) | separate film-production continuity, entered through the [Higgsfield skill](../skills/myscoutee-higgsfield/SKILL.md); not application manual QA |

The companion `tools/trust/suite/` keeps model-regression prompts, semantic
assertions, and accepted baseline reports outside the context loaded by the
model. `tools/trust/run-trust-evals.mjs` executes or validates that suite.

## Deep workflow

1. Establish parent, frontend-submodule, sibling-repository, and relevant
   runtime state without disturbing user work.
2. Classify behavior and risk with [routing.md](routing.md) and
   [risk-model.md](risk-model.md).
3. Recover intent from [sources.md](sources.md), current implementation, tests,
   one relevant reference in [patterns/catalog.md](patterns/catalog.md), and
   Git history when removal intent matters.
4. State current behavior, required behavior, smallest owning layer, predicted
   files, explicit non-goals, and root-cause evidence before behavioral edits.
5. Apply only routed habits/reviews; run the efficiency scan on changed loops,
   batch operations, storage access, projection, bootstrap, and multi-step
   workflows.
6. Verify the real mutation/read, save/reload, local/HTTP, restart/retry,
   environment, security, or artifact contract using
   [evidence-model.md](evidence-model.md).
7. Finish with [reviews/completion.md](reviews/completion.md). Capture a user
   correction as a candidate only when it generalizes beyond the current task.

## Internal precedence

1. Current explicit user instruction.
2. Canonical product, architecture, security, or operations source.
3. Accepted invariant in `constitution.md`.
4. Accepted learning.
5. Approved reference pattern.
6. Candidate reference or learning.
7. Repository frequency and historical code.

If higher-level sources conflict, expose the conflict and avoid an irreversible
or behavior-changing guess. Git history is evidence, never automatic authority.

## Boundaries

This library does not:

- authorize broader edits, builds, restarts, external writes, or destructive
  actions;
- make a frequent AI-generated implementation correct by popularity;
- turn unsupported checkbox answers into evidence;
- copy secrets, raw transcripts, personal data, or obsolete runtime commands;
- replace maintained canonical documentation with condensed memory.

Maintain the library according to [maintenance.md](maintenance.md) and validate
structural changes with `tools/trust/validate-trust-library.sh`.
