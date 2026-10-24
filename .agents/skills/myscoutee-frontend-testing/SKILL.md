---
name: myscoutee-frontend-testing
description: Run focused MyScoutee npm/Angular tests, temporarily stopping and restoring frontend-sync when running. Compilation-only builds follow the repository resource rules.
---

# Serial frontend tests

**MANDATORY: WHEN THE USER REFERS TO AN EXISTING IMPLEMENTATION OR BEHAVIOR,
INSPECT THAT REFERENCE FIRST AND COMPARE IT WITH THE TARGET CODE BEFORE MAKING
CHANGES. REUSE THE REFERENCED IMPLEMENTATION WHERE APPLICABLE. DO NOT SUBSTITUTE
ASSUMPTIONS, MEMORY, OR A CUSTOM IMPLEMENTATION FOR THIS INSPECTION.**

Use the existing `frontend/package.json` test script and the installed, pinned
components npm package; do not create another runner or cache. Consumers do not
build a components workspace. Shared-library source, builds and component specs
belong to the separate `myscoutee-components` repository.
Apply the repository trust mode and resource rules. An explicit current
no-test/no-stop instruction takes precedence over this authorized sequence.

When the development server/stack is stopped, standalone npm tests, builds and
other normal project checks are allowed. Do not start a server or frontend-sync
solely to perform them. Check for leftover test/build/watch owners before running
a command; the stop/restore steps below apply only to sync that was running.
For large code-change batches while the stack is running, follow AGENTS.md's
temporary frontend-sync stop/restore rule.

**DOCUMENTATION COMES LAST: COMPLETE THE IMPLEMENTATION AND REQUIRED TESTING
BEFORE WRITING HANDOFFS, EVIDENCE SUMMARIES, OR STATUS DOCUMENTS. DO NOT INTERRUPT
ACTIVE TESTING TO DOCUMENT PROGRESS. KEEP USER-FACING UPDATES BRIEF.**

At completion, update only the relevant current-state entry in the existing
handoff: result, any remaining work, and whether frontend-sync was restored.
Reference existing test output. Preserve previous summaries and history; do not
rewrite the document or append a running narrative.

1. Identify the existing `frontend-sync` container and its watcher process tree;
   record whether it is running. Check for another test/build owner. Nested npm
   wrappers in one existing owner tree are not separate competing test runs.
   Before starting, report the current checkpoint and the exact focused test.
   Apply the [memory preflight](../../trust/habits/runtime-and-tests.md#memory-preflight)
   before stopping owners and recheck after they exit; spare CPU or a JVM heap
   limit alone does not establish enough capacity.
2. If running, stop only that container (`docker stop frontend-sync`) and wait
   for its watcher descendants to exit. Do not test if stopping fails or another
   test/build owner remains; resolve that owner first. Leave other services alone.
3. From `frontend`, run one focused `npm test -- --watch=false` with the needed
   supported test filter. This uses the consumer's existing Angular test runner
   without compiling the library.
   Never start a second test, build or watcher beside it.
4. After success or failure, wait for the test and its descendants to exit.
   On cancellation, clean up only this test's processes before restoring sync.
5. If sync was previously running, start the same container with
   `docker start frontend-sync`; inspect its logs/readiness. Do not recreate the
   stack or start a service that was initially stopped. Respect a later explicit
   stop/no-restart instruction and report if it prevents restoration.

Report test outcome and restoration status briefly as distinct facts. For
compilation-only verification while the development stack is running, use its
existing watcher and logs. When the stack is stopped, a standalone build is
allowed; actual tests may also run normally.
