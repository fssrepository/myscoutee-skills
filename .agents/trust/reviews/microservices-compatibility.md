# Review: monolith and independent domain deployment

Authority: explicit MSC-120/MSC-121 user requirements, 2026-10-08. This is a
continuing backend constraint, including features added after the initial split.
Read the current status in `guides/microservices/README.md`; do not infer readiness from
this design requirement.

## Ownership and composition

- Keep one canonical business implementation under `server/projects/profile`.
  The legacy directory name is intentional. Do not copy sources into service
  directories, fork behavior, or make the monolith depend on the shell.
- Canonical source/configuration improvements belong to MSC-120 while that
  refactor is active. Shell packaging, transport and lab operations belong to
  MSC-121. Preserve that review boundary even when both are needed.
- Domain code depends on another domain's API/DTO contract. Do not import its
  services, controllers, repositories, persistence documents or configuration.
  Wire DTOs must not expose persistence or SDK objects accidentally.
- Reuse domain-owned Spring configuration and precise package boundaries. A
  domain must load in the monolith and its selected assembly. One shared
  bootstrap source may be compiled into all artifacts; each artifact contains
  only its selected implementations and explicit shared infrastructure.
- `config/microservices/assemblies.json` owns grouping. Initially six deployments;
  splitting or regrouping is configurable, not a fixed one-domain/one-JVM rule.
  Review adapters when a boundary moves. Never package multiple monoliths and
  call them independent services, or add a catch-all core deployment.

## Network behavior

- An in-process interface is not automatically a wire protocol. Reuse explicit
  typed adapters and versioned contracts. Keep business rules in the domain.
  Do not hide missing bindings with stubs, reflection RPC or local fallbacks.
- Preserve authenticated actor/workspace authority, locale and REAL/DEMO mode.
  Receiving services validate delegated authority; public headers cannot select
  an actor, workspace or database. Service authentication alone is not user
  authorization. Restore thread-local context after every request/error.
- Bound connect/request time, response size and concurrency. Batch hot reads;
  inspect loops for new remote N+1 calls. Keep logs and metric labels free of
  credentials, payloads and unbounded user/workspace identifiers.
- A timeout is an unknown outcome, not proof of rejection. Reuse existing
  idempotency/outbox/compensation owners. Payment finalization must not blindly
  refund after a lost remote reply. Add saga infrastructure only for a proven
  durable coordination gap.
- Persist remote mutation intent with its owning state before delivery. Reuse the
  contact journal, profile/status work, feedback counter receipts, lifecycle work
  and existing notification/email/affinity owners where applicable. A stable
  receipt must reject changed content and preserve completed state on replay.
- Owner document versions require coordinated writer upgrades. Use the versioned
  backend stop/deploy guard; never mix pre-version writers with the migrated
  `assets`, `events` or `eventFeedbackStates` collections. Deployment evidence
  remains separate from source-only recovery tests and generated contracts.
- Identify one owner for each scheduler, index and write side effect. Moving or
  scaling a domain must not create duplicate workers or uncoordinated writes.

## Runtime and evidence

- Reuse production-profile settings and optimized runtime-only images. No
  dev/sync/watch services, source mounts, DevTools or build tools at runtime.
- Include the existing production supporting services and reuse every canonical
  data initializer/importer: Mongo collection allowlists and REAL/DEMO sources,
  MinIO media seed, registry DEMO seed and simulator initialization. Packaging
  may map endpoints, paths and database names; it must not substitute a smaller
  invented dataset or silently overwrite existing application state. Verify
  actual imported data and persistence after pod replacement, not just health.
- The lab uses one shared MongoDB replica set (two members requested by the
  user), with distinct REAL/DEMO databases and bounded pools. Keep primary reads
  unless consistency requirements explicitly permit another preference. Two
  voting members require both for majority writes; this is not one-node-loss HA. Preserve existing tenant/workspace semantics; do not add a Mongo per
  service. Keep isolated lab data and credentials separate from production.
- Include bounded Prometheus/Grafana resources in the memory budget. Check the
  live host before builds/startup and obey the existing dev-owner rule.
- This is a developer host: no lab VM, network, pool or newly installed lab
  daemon may be enabled at host boot. Guest services may start when the user
  explicitly starts the VM. Account for libvirt socket activation and guest
  save/resume, not only the VM's autostart flag.
- All installation/configuration/start/stop/destroy/purge paths are versioned,
  idempotent scripts or IaC. Track exact ownership; preserve pre-existing or
  changed resources. No global prune, firewall flush or package autoremove.
  Keep keys, Terraform state, kubeconfig, credentials and disks outside Git.
- Prove the changed boundary: monolith regression, assembly ownership, real HTTP
  serialization/errors/scope, and persistence/restart/lost replies as relevant.
  Report separately what builds, starts, passes an actual flow, survives retry,
  and has been qualified for production. A booting pod is insufficient evidence
  for an immediate production migration.
