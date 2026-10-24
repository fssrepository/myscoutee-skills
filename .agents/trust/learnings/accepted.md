# Accepted project learnings

These habits are accepted because they are backed by canonical project
boundaries, repeated explicit user correction, or both. Each includes the
question that must interrupt recurrence.

## L001 — Root cause, never a plausibility fallback

Trigger: a route, test, query, or UI flow fails and an alternate value/path
would make it appear to work.

Ask:

- What is the first proven incorrect boundary?
- Would this change make the failure less visible without repairing its owner?
- Am I adding a second behavior path that future tasks must reconcile?

Action: continue diagnosis. Do not add fallback/repair behavior unless it is an
explicit product requirement with defined semantics and tests.

Provenance: repeated explicit corrections in the 2026-06-01 UI/E2E session and
2026-07-22 onward local/HTTP sessions.

## L002 — Never silently change or resurrect behavior

Trigger: changing defaults, filters, status transitions, permissions, timing,
persistence, removal/restore behavior, or code removed in history.

Ask:

- What observable behavior changes?
- Did the current request authorize that change?
- Why was the historical behavior removed, and does current authority require
  it now?

Action: state the behavior delta and keep unrelated behavior intact. Git
history informs diagnosis but does not authorize restoration.

Provenance: the central trust failure in the 2026-06-01 session was restoring
behavior-sensitive Java repair code and then changing it back.

## L003 — A failing test does not select the production-code fix

Trigger: any red unit/E2E/stress/UI test.

Ask:

- Is the defect in product logic, data, seed, test expectation, runner, profile,
  or runtime health?
- Would I want this production behavior change if the test did not exist?

Action: prove the owning failure class before editing Java/frontend behavior.

Provenance: 2026-06-01 E2E failures and repeated instructions to fix incorrect
database JSON rather than introduce Java repair behavior.

## L004 — Keep fixes narrow and reviewable

Trigger: a focused task begins touching adjacent services, broad refactors, or
many behavior-sensitive files.

Ask:

- Which new file is necessary for the requested outcome?
- Can the user still review the causal change independently?
- Am I refactoring because the nearby code is imperfect rather than blocking?

Action: one proven issue/owner at a time; defer unrelated cleanup.

Provenance: repeated 2026-06-01 correction that broad edits and back-and-forth
changes made the state impossible to trust and review.

## L005 — Preserve local/HTTP observable parity

Trigger: a workflow works in frontend local but fails through the running HTTP
stack, or vice versa.

Ask:

- At which mapper/DTO/persistence/query boundary do results diverge?
- Am I changing the working side merely to resemble the broken side?
- Have create/update/clear/reload semantics been compared end to end?

Action: treat the working adapter as behavioral evidence, then repair the
incorrect owning boundary without cloning or changing the working behavior.

Provenance: repeated July 2026 event, asset, payment, counter, and save/reload
sessions.

## L006 — Keep demo, E2E, and production state physically and semantically separate

Trigger: seed copying, database/profile rename, Compose change, reset/import, or
packaging.

Ask:

- Which environment owns this data?
- Is this an independent copy or an alias/symlink to another mutable state?
- Will synthetic data enter production or a real Registry?

Action: preserve separate seed directories/databases/Registry identities and
verify reset/import/package behavior.

Provenance: explicit 2026-06-01 instruction that the three databases remain
separate actual clones and production be free of synthetic activity.

## L007 — Fix canonical data and forward mutation separately

Trigger: current disposable DB data is manually patched or cleanup is needed.

Ask:

- Will the defect return after reset/import?
- Is the canonical JSON/builder wrong?
- Are new mutations also producing inconsistent state?
- Do existing records need a bounded cleanup distinct from forward code?

Action: correct every proven owner; do not report a live DB edit as a lasting
fix or add permanent application repair.

Provenance: July 2026 recurring data/materialization/counter cleanup failures.

## L008 — Hot badges/counters require write-path ownership

Trigger: menu badges, buckets, membership/resource counters, or a slow query
repeatedly projecting child state.

Ask:

- Is this value intended to be maintained on the authoritative mutation?
- Did every transition update parent and child state consistently?
- Can retry, delete, suppress, leave, restore, or approval double-count?

Action: when the established design uses compact parent/read state, update it
transactionally/idempotently and test it; do not hide inconsistency with heavy
query projections.

Provenance: repeated July 2026 instructions about event/resource badges and
parent counters.

## L009 — Respect the user's running environment

Trigger: considering a build, server, Compose stack, browser, or long test.

Ask:

- Is the intended dev/E2E stack already running?
- Did the user say no build/restart/Chrome or name the exact stack to use?
- Will this command contend for resources or invalidate their manual test?

Action: inspect and use the named runtime; do not start duplicates. Treat
session-specific no-build/no-browser instructions as active until superseded.

Provenance: repeated July 2026 requests to use the existing dev stack and avoid
resource-heavy builds or duplicate processes.

## L010 — Hold the original task while accepting additions

Trigger: the user adds issues with “continue”, “after you finish”, or “also”.

Ask:

- What was the original unfinished outcome?
- Is this an addition, replacement, or constraint?
- Which promised verification still remains?

Action: update the task ledger; do not forget the initial request or stop after
only the newest detail.

Provenance: 2026-06-01 session where the original full UI stress/testing goal
was lost amid successive fixes.

## L011 — A visible update is not persistence proof

Trigger: edit/save, counters, polling, payment/audit, delete/restore, or nested
form data.

Ask:

- Does the value survive reopen/reload/restart?
- Does an immediate query match the mutation without opening another screen as
  a hidden refresh?
- Are cleared values, nested fields, and immutable audit values preserved?

Action: test the full mutation/read or save/reload loop on each relevant
adapter.

Provenance: repeated July 2026 saved-field, menu-counter, payment-summary, and
late-poll issues.

## L012 — Stop and undo mean immediate boundary changes

Trigger: explicit stop, no edit, no build, no restart, do not touch, or undo.

Ask:

- Am I about to finish an action the user explicitly stopped?
- Which exact diff/process belongs to this agent?
- Can undo preserve all user-owned work?

Action: stop new actions immediately; terminate only safe agent-started work;
undo only agent-owned changes and verify the resulting state.

Provenance: 2026-06-01 escalation caused by delayed compliance and repeated
back-and-forth edits.

## L013 — Sample every changed flow for repeated expensive boundary work

Trigger: changed loops, repository calls, projections, bootstrap steps, storage
access, polling, or batch processing—even when the task was not labeled as a
performance task.

Ask:

- Is there a database/IndexedDB/network/filesystem call inside iteration,
  including inside a helper?
- Can the state be fetched once, indexed in memory, batched, or passed between
  steps?
- Does the alternative preserve bounded memory, consistency, audit, and error
  semantics?

Action: remove avoidable N+1/boundary calls or record why per-item work is
required and bounded. In demo bootstrap, hydrate IndexedDB once and pass the
same in-memory graph between steps before flushing completed state.

Provenance: explicit 2026-08-03 continuity requirement, reinforced by the
canonical demo bootstrap architecture boundary.

## L014 — Preserve the requested live-list scope

Trigger: creating or materially changing a SmartList/list surface.

Use the [SmartList pattern](../patterns/smart-list-live-surface.md): preserve
existing refresh behavior or reuse the exact requested reference flow. Ask only
when missing information blocks the requested work or entails a material,
destructive or irreversible scope decision. Do not ask optional polling or
adjacent-capability questions, or add polling simply because it is available.
Use shared visible-item APIs for confirmed mutations; justify a full reload.

Provenance: the current AGENTS.md focus/continuation rule supersedes the
2026-08-03 instruction to always ask about polling. Shared progress, scheduler
and reconciliation ownership remains unchanged.
