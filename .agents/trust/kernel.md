# MyScoutee trust kernel

This is the compact default habit loop. It protects continuity without loading
the full project memory on every task. Current user and system instructions
always outrank this library.

## Runtime authority

[development rules](../../instructions/myscoutee-development.md#critical-local-resource-rule) owns resource limits,
watcher/cache-lock handling, serial KVM/monolith checks and JUnit/frontend test
exceptions. Apply those rules; this library does not grant additional runtime
permissions.

## Mode behavior

- `light`: use this file only.
- `standard`: use this file and load only the matching cards below.
- `deep`: also read [manifest.md](manifest.md), [constitution.md](constitution.md),
  [routing.md](routing.md), [risk-model.md](risk-model.md),
  [evidence-model.md](evidence-model.md), [system-map.md](system-map.md),
  [sources.md](sources.md), [working-context.md](learnings/working-context.md),
  [accepted learnings](learnings/accepted.md), and
  [completion review](reviews/completion.md), then load matching cards.

Load each relevant file once per active task; reuse its context until the file,
scope or user instruction changes. Route by the work actually performed, not
keywords in quoted docs. Links are references, not recursive read requirements.
A narrow documentation edit needs no application-layer or runtime checklist.
Do not inventory the library, recover history, fill templates or update learnings
routinely. Continue independent work without optional preference questions.

## Six-step loop

1. **Protect state.** Before editing, inspect parent worktree state and the
   frontend submodule when present. Preserve pre-existing user changes; apply
   stop, undo, no-edit, no-build, and no-restart instructions immediately.
2. **Pin intent.** Keep the primary outcome and queued additions. Identify
   current behavior, required behavior, owning layer, explicit non-goals,
   predicted files, and promised evidence.
3. **Find the first wrong boundary.** Separate product, seed/data, adapter,
   backend, environment, test, harness, and runtime defects. A failure does not
   itself select the production-code fix.
4. **Change narrowly.** Do not add an unrequested fallback, repair path,
   compatibility branch, historical resurrection, or adjacent refactor.
5. **Cross fewer boundaries.** Inspect changed loops and helpers for repeated
   DB, IndexedDB, HTTP, filesystem, mapping, or projection work. Fetch/batch
   once or pass in-memory state when correctness remains intact.
6. **Prove and report.** Match verification to the real contract, review the
   final diff, and distinguish passed, failed, not-run, and not-proven claims.

## Standard routing

Preserve both monolith and independent domain packaging for new backend work.
Canonical business source stays in `server/projects/profile`; `myscoutee-microservices` owns common runtime/deployment mechanisms;
application `config/microservices/` owns product composition, and optional
source units stay with their domain/common owner. Cross-domain calls use the owner's
API/DTO contract, never its service, repository or document implementation.
Developer-host lab VMs must never start on host boot; setup, explicit startup
and owned cleanup belong in versioned scripts. Load the microservices card below
for the detailed checks; a successful build does not prove a working split.

Load matching rows for affected behavior; deduplicate shared cards. Questions
in cards are internal review prompts, not a user questionnaire:

| Trigger | Load |
| --- | --- |
| Defect or failed test | [bugfix review](reviews/bugfix.md) |
| Unclear defect crossing several boundaries | [diagnosis habit](habits/diagnosis-before-change.md) |
| Angular/UI/shared-core | [frontend review](reviews/frontend.md) |
| Popup/dialog/drawer/page surface containing a list or SmartList | [SmartList live-surface pattern](patterns/smart-list-live-surface.md) |
| New frontend service/adapter/store slice | [frontend pattern](patterns/frontend-vertical-slice.md) |
| Java controller/service/repository/model | [Java review](reviews/java-backend.md) |
| Backend domain, dependency, configuration, worker, transport or deployment change | [Microservices compatibility](reviews/microservices-compatibility.md) |
| New Java endpoint/domain slice | [Java pattern](patterns/java-domain-slice.md) |
| Seed, fixture, Mongo JSON, IndexedDB | [data review](reviews/data-and-seeds.md) |
| Environment, Compose, profile, adapter mode | [environment review](reviews/demo-e2e-production.md) |
| Counter, badge, bucket, aggregate, projection | [derived-state review](reviews/derived-state.md) |
| Changed loop/batch/I/O or projection | [efficiency habit](habits/efficiency-scan.md) |
| Performance investigation or measurement | [performance review](reviews/performance.md) |
| Test/E2E/stress/runner/fixture | [testing review](reviews/testing.md), [runtime habit](habits/runtime-and-tests.md) |
| Registry, signatures, receipts, ledger, identity | [protocol review](reviews/protocol-and-registry.md), [security review](reviews/security-and-privacy.md) |
| New/reworked durable external operation | [durable-work pattern](patterns/external-durable-work.md) |
| Cross-repository or frontend/backend contract | [cross-repository review](reviews/cross-repository.md), [full-flow habit](habits/full-flow-evidence.md), plus each owning layer |
| Auth, secrets, privacy, permissions | [security review](reviews/security-and-privacy.md) |
| Packaging, update, backup, restore, release | [packaging review](reviews/packaging-and-release.md), [security review](reviews/security-and-privacy.md), [durable-work pattern](patterns/external-durable-work.md) |
| UI text, i18n, help, manual, roadmap | [docs/i18n review](reviews/docs-and-i18n.md) |
| New abstraction/helper/service/framework | [search-before-create habit](habits/search-before-create.md), plus owning layer |
| Behavior removal/default/compatibility change | [change discipline](habits/change-discipline.md), [bugfix review](reviews/bugfix.md) |

Load [completion review](reviews/completion.md) only for behavior changes,
cross-boundary work, high-risk operations, or when preparing a strong
completion claim. For a narrow mechanical change, the completion check below
is sufficient.

## Deep-mode triggers

Consider `deep` when the task changes security/privacy, private keys,
payments/accounting, Registry protocol, destructive data migration,
backup/restore, production packaging/release, or three or more system/persistence
boundaries, or when canonical docs, tests, current code and history conflict.
Keep the resolved mode; do not silently escalate it. State a material risk and
load applicable cards within that mode.

## Compact completion check

Before finishing, establish:

- requested outcome and observable behavior delta;
- exact changed files, including submodule/sibling-repository state;
- focused checks run and their results;
- relevant save/reload, reset/import, local/HTTP, retry/restart, security, or
  artifact boundary not exercised;
- final scope/diff review and any remaining risk;
- whether a repeated user correction belongs in
  [candidate learnings](learnings/candidates.md).
