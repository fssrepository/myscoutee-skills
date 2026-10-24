# MyScoutee working context

This is a project-specific collaboration context, subordinate to the current
user request.

- The user expects autonomous progress and does not want to repeat established
  constraints. Discover safe answers from the repo and running environment
  before asking.
- The user strongly prefers root-cause correction over fallback, repair, or
  compatibility hacks that make a symptom disappear.
- Behavior changes must be reviewable and explicit; preserving working behavior
  matters more than opportunistic cleanup.
- The frontend local implementation is often a useful behavioral reference for
  HTTP defects, but it is not automatically canonical and must not be changed
  merely to resemble Java internals.
- The user commonly tests a running dev HTTP stack manually. Process/build
  actions can interfere with that work, so inspect and respect the stated
  runtime.
- Additions made during a long task are usually cumulative unless clearly
  replacing the prior request. Maintain a task ledger.
- The project contains substantial AI-generated history. Curated references and
  canonical boundaries outrank code frequency.

Do not treat old session-specific commands as permanent. For example, “do not
launch Chrome” or “do not build” remains active for that task/runtime, not all
future work.

