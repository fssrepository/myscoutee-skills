# MyScoutee development rules

Scope: MyScoutee base, backend and template development. Command and code paths are
relative to the active application repository root. Markdown links within this
checkout refer to the shared instruction library.

## CRITICAL LOCAL RESOURCE RULE

- Keep CPU scheduling unrestricted unless the user explicitly requests a
  particular CPU set. Do not apply `taskset`, CPU affinity, container CPU-set
  pinning or equivalent restrictions to builds/tests as an improvised response
  to temperature. Logical CPU numbers may be sibling threads of one physical
  core; concentrating work there can prolong a hot spot.
- Let the operating system and runtimes schedule work across the available
  CPUs. When the user assigns the host to this work, do not add
  `-XX:ActiveProcessorCount`, fixed Gradle worker caps or CPU quotas merely to
  serialize work. Use supported parallel tasks and normal host detection.
- Independent builds, analyses and runtime checks may overlap when their actual
  memory demand fits the host and they do not share mutable outputs or test
  state. "One owner" applies to a particular watcher, output/cache lock or
  fixture, not to every process on the machine. Do not bypass a real lock.
- Rely on normal OS scheduling and hardware thermal management. Do not respond
  to a brief temperature peak or throttle-counter change by pinning work,
  silently reducing parallelism, repeatedly restarting builds or changing fan
  controls. Investigate actual critical alarms, failures or sustained abnormal
  behavior separately from routine build scheduling.
- The running-pipeline restrictions below apply while a development server/stack
  is running. When it is stopped, standalone npm tests, builds and other normal
  project checks are allowed; do not start a server just to obtain a watcher.
  Check for leftover test/build/watch processes and avoid overlapping owners.
- Reuse the running hot-deploy/watcher for compilation and builds, regardless
  of spare capacity. Trigger it through a narrow relevant source change or the
  project's trigger and inspect its logs. Do not duplicate its work with another
  npm, ng test, Vitest, Gradle, Java build, watcher, test or server process.
- While the development stack is running, outside the test exceptions below,
  a separate focused build/test requires
  that the running pipeline does not perform it, capacity has been checked and
  the user has not prohibited it.
- For a cache lock or stuck hot-deploy, identify the owning process. Never bypass
  it with a new cache, `GRADLE_USER_HOME`, `/tmp` workaround or second process.
  Restart only that owner; ask if ownership or restart impact is unclear.
  Whenever replacing an existing owner process, stop it before starting its
  replacement; never overlap them.
- Assess response-time and CPU impact proportionally. Small steps use focused
  JUnit tests and existing runtime health/logs/CPU evidence. Run matched
  load/stress measurements after a coherent change batch or for a concrete
  performance concern: same workload, data, concurrency, warmup and deployment
  limits; record both source revisions and increases as well as decreases.
  Functional success does not prove performance parity.
- Validate completed backend change batches on KVM and monolith. Focused
  runtime checks are required in both; duplicate stress runs are not required
  by default. Keep VM startup until final qualification when requested.
  Independent environments may overlap when memory and fixture isolation allow.

**Authorized test exceptions:**

- Backend: run standard/embedded JUnit serially through
  `../myscoutee-microservices/tools/run-backend-junit.sh`, including while the dev server runs. It isolates
  outputs/state in `build/junit` and `server/build/junit-gradle`, without signaling
  DevTools or connecting to dev databases. Integration tests remain opt-in;
  this permits neither a second server nor changing the QA deployment.
- Frontend: follow the [frontend test skill](../.agents/skills/myscoutee-frontend-testing/SKILL.md).
  Stop existing `frontend-sync`, wait for watcher exit, run one non-watching
  test, wait for its descendants to exit, then restore the same previously
  running service even on failure. Never overlap test/build owners.
  With the development stack running, compilation-only verification stays with
  the existing watcher; with it stopped, standalone builds are allowed.
- During a large frontend code-change batch with the development stack running,
  temporarily stop `frontend-sync` and wait for its watcher to exit to avoid
  rebuilding intermediate edits. Restore the same previously running container
  after the batch/tests, including on failure, unless the user says to leave it
  stopped. Leave the other services alone.

## Trust mode gate

Resolve once at engineering task start (code, configuration, seed, test,
packaging, operations or architecture). Precedence: explicit current user mode
(`trust off`, `trust light`, `trust standard`, `trust deep`), then `.trust-mode.local`,
then `standard`. Report invalid local values and use `standard`.

- `off`: do not load the trust library.
- `light`: read [kernel](../.agents/trust/kernel.md) only.
- `standard`: read kernel and only its task-matched cards.
- `deep`: follow kernel's deep-loading route before editing.

Current user and higher-priority instructions still apply. Skills/harnesses
cannot override the selected mode. Do not change the gitignored local override
unless asked; its manager is `../myscoutee-skills/tools/trust/trust-mode.sh`, run from the
active application repository.

