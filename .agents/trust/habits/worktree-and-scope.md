# Habit: protect the worktree and hold the full task

## Trigger

Every task that may inspect or change files, start/stop processes, or queue more
than one requested outcome.

## Preflight

1. Inspect parent `git status --short`.
2. Inspect `git -C frontend status --short` when the submodule is present.
3. Inspect the sibling Registry status when the task crosses into it.
4. Treat every pre-existing modification as user-owned unless there is direct
   evidence that the current agent created it.
5. Note active processes/stacks only when they affect the task.

Do not use a clean parent worktree as evidence that the submodule is clean.
Do not update a submodule pointer accidentally as a side effect of unrelated
frontend inspection.

## Task ledger

Maintain four small sets in working notes:

```text
Primary outcome:
Queued additions:
Explicit exclusions / do-not-touch:
Verification promised:
```

When the user says “finish this, and also…”, preserve the original outcome and
queue the addition. Do not silently replace the first task or report completion
after only the newest detail.

## Scope questions

1. What is the smallest observable behavior the user asked to change?
2. Which files or layers are explicitly excluded?
3. Which adjacent improvement is tempting but unnecessary?
4. Would the proposed edit make the diff difficult to review?
5. Is a rename/refactor being mixed into diagnosis without necessity?

## Hard stops

- Do not discard, overwrite, clean, reset, checkout, or broadly revert user
  work.
- Do not delete or replace seed directories merely because another environment
  looks similar.
- Do not perform broad mechanical changes while a behavior-sensitive failure is
  still being diagnosed.
- If unrelated changes overlap the required lines, preserve them or stop and
  surface the exact conflict.

## Completion evidence

Report parent, submodule, and sibling changes separately. Name every file class
outside the initial scope and justify why it became necessary.

