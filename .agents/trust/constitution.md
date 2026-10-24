# MyScoutee constitution

These are stable identity and ownership constraints distilled from the current
project context and roadmaps. Detailed canonical sources remain authoritative;
this file turns them into short continuity checks.

## Product identity

- MyScoutee optimizes for completed, mutually welcomed real-world group
  meetings, not endless swiping or message volume.
- Matching uses editable 1–10 priorities, mutual affinity, and group-centric
  coordination. Changes must not silently collapse this into binary matching.
- Local deployments retain their operator, brand, infrastructure, community,
  ordinary application data, and operational independence.
- Network accounting and a possible future exit are optional shared rails, not
  central ownership of the local product.

## Deployment and network boundary

- Angular talks to its local Java backend for application, operator, claim, and
  accounting operations.
- Java is the only component in a deployment that calls an external Registry
  and owns the deployment private key.
- The browser never receives deployment, Registry, provider, or host-operation
  private keys and never calls the Go Registry directly.
- The Go Registry is a separate accounting and identity service. It does not
  become the store for local profiles, chats, events, payments, precise
  locations, or branding.
- A Registry outage must not prevent the local product from starting or serving
  ordinary local workflows.
- Registry endpoint selection is explicit deployment data. Moving to another
  endpoint requires the defined signed deactivation and fresh-registration
  flow; an active URL is not silently rewritten in place.

## Trust, identity, and privacy

- A deployment signature proves which deployment submitted a claim; it does
  not prove that the underlying human activity is truthful.
- External login identity is scoped as `(provider, issuer, subject)`. A Firebase
  UID alone is not globally meaningful.
- Raw identifiers, Firebase tokens, chats, profiles, and precise locations do
  not enter public/auditable network accounting.
- Global-human linking requires the versioned privacy protocol and explicit
  member consent. Authentication migration remains a separate concern.
- Secrets are write-only or masked across browser boundaries and must not enter
  seed data, logs, public ledgers, packages, or source control.

## Accounting and durable state

- Accepted accounting changes are append-only. Corrections, disputes, and
  supersession add records rather than rewriting accepted history.
- Signed outbound records are persisted before network attempts and retried
  idempotently until a verifiable signed receipt exists.
- Query tables or cached counters must remain transactionally consistent with
  their authoritative mutation when the design chooses write-time derived
  state. Do not hide inconsistency with expensive query-time repair.
- Claims, leaderboard rows, weights, and groups are provisional accounting
  facts, not legal entitlement or payout decisions.

## Environment isolation

- Browser-local Explore is an explicit offline adapter only. Backend-connected
  development, E2E, and production Explore use Java and server-side data.
- `demo_db`, `e2e_db`, and the production application database are separate
  operational states. Do not symlink or alias their seed directories.
- Demo data may be synthetic and illustrative. E2E data must be deterministic
  and disposable. Production user data starts empty except for explicitly
  allowed catalogs/configuration.
- The internal production Explore Registry has its own seeded SQLite state,
  identity, key/state volumes, scope, and no host port. It can never be selected
  as the real operator Registry.

## Frontend architecture

- Preserve the shared/core contract, base service, local adapter, HTTP adapter,
  mapper/repository, and shared signal-store responsibilities.
- Presentation components do not own transport policy, route delay, retry,
  timeout, cross-route caching, or durable business state.
- Artificial local route delay is centralized in the configured adapter layer.
  HTTP paths use central request timeout/error policy and do not inherit local
  artificial delay.
- Browser-local seed bootstrap hydrates IndexedDB once, carries one in-memory
  graph through the builders/repositories, and flushes completed steps. Do not
  re-query IndexedDB between seed steps.
- Equivalent local and HTTP workflows must preserve their user-visible
  semantics even though their persistence implementations differ.

## Java and operational architecture

- Preserve controller/service/mapper/repository ownership unless a deliberate
  architecture change is in scope.
- Do not repair seed data from application services or add production fallback
  behavior to make a fixture/test pass.
- Privileged host operations remain narrow, fixed-schema, fail-closed workers.
  Java cannot turn Registry or browser input into arbitrary host paths or shell
  commands.
- Updates are explicitly operator-approved, signed, durable, recoverable, and
  bound to exact artifacts and image identities.
- Release qualification concerns one immutable candidate and evidence set.
  Passing source tests is necessary but not sufficient.

## Human collaboration contract

- Preserve user work and make changes reviewable.
- Do not silently change behavior, remove behavior, resurrect removed behavior,
  or broaden scope.
- Diagnose root causes; do not add fallback paths that conceal them.
- Explicit stop, no-edit, no-build, no-restart, and undo instructions take
  immediate effect.

