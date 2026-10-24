# Habit: respect the existing runtime and test the intended environment

## Trigger

Before starting, stopping, rebuilding, restarting, stress-testing, or launching
a browser/server/container.

## Runtime preflight

1. Determine whether the user already has a dev/E2E/production-like stack
   running.
2. Inspect its health and configuration before starting another instance.
3. Identify which database/profile/frontend configuration it actually uses.
4. Respect explicit instructions such as no build, no restart, no Chrome, or
   use the running stack.
5. Estimate whether the command is CPU-, memory-, disk-, network-, or
   state-destructive before launching it.

## Memory preflight

This also applies before source edits that trigger an already-running watcher;
reusing that watcher does not waive the resource check. Recheck available RAM,
swap activity and CPU temperature during compilation, at least every 30 seconds.
If memory pressure or thermal throttling appears, stop the agent-owned build or
pause its watcher before further edits. After a machine crash, inspect the prior
boot logs and current owners before resuming; do not automatically restart the
stack, watchers or all QA browsers together.

Before an isolated frontend, backend or microservice test/build, report the
current checkpoint, planned command and temporary owner changes. Inspect fresh
`free -m`, `vmstat 1 3` and process RSS (`ps -eo pid,ppid,comm,rss,pcpu --sort=-rss`).
Use available RAM, swap activity and the whole process tree's expected peak
(compiler, daemon, test workers and native overhead), not just `-Xmx` or free CPU.
Keep at least 1 GiB of RAM headroom beyond that estimated additional peak while
the interactive QA stack is running. A full swap with little available RAM or
active paging means do not start another heavy process in that state.

First release idle agent-owned QA browsers or pause an authorized watcher;
preserve fixture/session state and restore required owners afterward. Recheck
capacity before starting one serial test. If pressure rises or the UI becomes
unresponsive, stop the newly started test and wait for its descendants to exit.
Do not stop unrelated user processes or treat closing a browser as fixture reset.

## Frontend npm tests

For npm tests, follow the [serial frontend test skill](../../skills/myscoutee-frontend-testing/SKILL.md),
which owns stopping the watcher, serial execution and restoration after failure
or cancellation. With the development stack running, compilation-only checks
use the existing watcher and logs. With it stopped, standalone npm tests, builds
and other normal project checks are allowed under AGENTS.md's resource rules.

## Test selection

- Start with the smallest test that reproduces the changed contract.
- Do not change product code merely because a broad suite has unrelated or
  pre-existing failures.
- Rerun the focused test after the edit.
- Broaden to the owning suite, then cross-layer/E2E only when risk requires it.
- Use production-like optimized frontend output for render/bundle performance;
  use debuggable builds for diagnosis and state the overhead.
- Stress tests require an explicit representative profile and baseline. Do not
  universalize one throughput number.

## Process hygiene

- Do not leave duplicate servers, builds, Chrome processes, or test runners.
- Do not stop a user-owned process unless explicitly requested or necessary to
  complete an authorized workflow; identify the exact process first.
- If the user explicitly says stop/pause, stop issuing new actions and terminate
  only agent-started work when safe. A correction or status question does not
  cancel the active task.
- Report long-running commands, environment, and final process state.

## Evidence questions

1. Did the command test the code/configuration just changed?
2. Did it use the intended database and data source?
3. Did it mutate state, and was that state disposable?
4. Does passing prove the user-visible flow or only a component?
5. Are failures new, relevant, and reproducible?
