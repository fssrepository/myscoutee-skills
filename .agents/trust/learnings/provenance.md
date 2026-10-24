# Learning provenance and retention boundary

## Sources reviewed for version 0.1

- Current repository source, docs, tests, build/runtime configuration, and Git
  history as of 2026-08-03.
- Repository-local Codex export
  `.e2e-artifacts/codex-session-history/2026-06-01-ui-stress-from-1524-cest.*`:
  one long UI stress/E2E session with 148 user messages. The artifact is
  gitignored and is not referenced as a required runtime dependency.
- Local Codex active/archive session store: 429 retained sessions were found,
  with MyScoutee paths in 427. The earliest retained native session is dated
  2026-07-22; targeted review covered repeated root-cause, local/HTTP,
  data/seed, projection/counter, runtime, and instruction-following corrections.
- The current 2026-08-03 discussion defining the trust/continuity goal.

## Retention limitation

No native Codex sessions earlier than 2026-07-22 were present. The separate
2026-06-01 repository export predates them. Therefore prior conversations may
have been deleted or rotated; their number and content cannot be reconstructed
from available metadata.

## Privacy rule

This library does not reproduce raw transcripts, emotional language, threats,
personal paths, or unrelated personal data. It records engineering behavior,
scope, and provenance only.
