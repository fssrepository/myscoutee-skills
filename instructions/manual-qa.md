# MyScoutee manual QA

Apply these rules only for application QA work. Paths below are relative to the
active application repository root.

## User-authorized full-flow testing

Explicit delegation for a specified flow/checkpoint/campaign permits browser
inspection, navigation, clicks, forms and intended test submissions for that
scope. Discussion or documentation of delegation does not activate it. Once
granted, it persists until completion or user change/revocation; repair, retest
and continue without asking again at each step or defect.

This overrides the default manual-QA handoff boundary only for the delegated
scope. Otherwise the user controls the browser, and a defect report permits only
read-only diagnosis. Retain fixture/launcher requirements, resource rules and
explicit acceptance criteria; use the stable checklist without inventing rules
or expanding scope. Report verified results and actual blockers.

## Managed manual-QA browser sessions

- Verify the fixture baseline before every fixture-backed launch; use
  `npm --prefix tests/qa run browser -- CHECKPOINT_ID`. The versioned QA package
  loads `tests/qa/config/browser-session-checkpoints.json` directly.
- Its common harness snapshots and clears configured actors' server-side active
  sessions before demo logins to prevent `BLOCKED_LIMIT`. Keep this centralized;
  do not copy session mutations into scenarios. Normal fixture `reset` restores
  the retained session snapshot before restoring the fixture.
- Standardized startup grants no checklist actions after handoff; those require
  the explicit full-flow delegation above.
- Invoke the versioned checkpoint harness with Docker access to the existing
  MongoDB container. A socket permission error can falsely report
  `MONGO CONTAINER 'MONGODB' IS NOT ALREADY RUNNING`; rerun the same harness with
  Docker access and verify the container. Do not start, rebuild or duplicate
  MongoDB, servers, watchers or Compose stacks because of that error.

