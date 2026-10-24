# Candidate learnings

Candidates affect review questions but are not universal hard rules until
promoted.

## C001 — Prefer established interaction grammar for analogous flows

Observation: asset borrow repeatedly needed the same two-phase checkout,
summary, policy, payment, audit, and status grammar as event checkout.

Candidate habit: when the user says a flow should be similar to an existing
flow, inventory and reuse its behavior/component/store contracts before
creating a parallel implementation.

Promotion evidence needed: successful reuse across another independent flow
without forcing domain differences into a premature abstraction.

## C002 — Current rules may favor mutation-time derived parent state

Observation: repeated MyScoutee tasks favored updating compact parent counters
on mutation over expensive query projections.

Candidate limit: apply only to hot, well-owned read state with complete
transition, transaction, idempotency, cleanup, and reconciliation design.

Promotion evidence needed: identify a stable canonical pattern and tests across
multiple domains.

## C003 — Manual runtime constraints should persist within the task

Observation: commands such as “do not build” or “use the running dev stack”
were sometimes lost after context switched to another defect.

Candidate habit: record runtime constraints in the task ledger and recheck them
before every process-changing command.

Promotion evidence needed: validate that this does not retain obsolete
constraints across clearly new tasks.

## C004 — Preserve underlying surfaces when stacking popups

Observation: repeated user corrections reject hiding the avatar or a parent
popup when another popup opens. Keep the underlying surface mounted and visible;
reuse the shared popup layers and translucent backdrop for coverage and pointer
blocking. Do not add popup-specific opacity, visibility or parent-close rules.
The side menu is a navigation surface: the user explicitly requires it to close
when a popup or confirmation opens. This must not hide the avatar or close other
popups underneath.

Promotion evidence needed: verify nested popup state and backdrop behavior across
additional independent flows.

## C005 — Opening a popup must not wait for data it can load inside

Observation: setup waited for browser permissions and forcibly reloaded deployment
configuration before becoming visible. Reuse already loaded shared state, open
synchronously and show pending state only on controls requiring asynchronous data.

Promotion evidence needed: apply and verify the same boundary in another popup.


## C006 — Keep Angular input models stable and isolate effect side effects

Observation: the Work/Community delivery put freshly allocated popup, FormFlow,
menu and query models behind ordinary template methods despite the user's
explicit request to reuse the established patterns. Guide registration inside a
tracked effect also read and changed shared guide state, creating a repeatable
reactive cycle when surfaces were stacked.

Candidate habit: bind stable fields or computed signals; update form/filter state
through signals. Use the existing `untracked` boundary for guide registration and
SmartList mutation calls from effects. Inspect the callee's signal reads as well
as the effect body. Do not treat a successful Angular build as reactivity proof.

Evidence: the old Campaign dev artifact exceeds a bounded 50-effect execution
check; the corrected compiled components settle and preserve model identity.
The regression check also covers nested guide contexts and mutation-to-list state.
Promotion evidence needed: repeat this check for further independently changed
surfaces and record browser verification separately from component-level evidence.
