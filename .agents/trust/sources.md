# Canonical sources

This index routes to existing authority instead of copying large documents into
the trust library.

## Cross-system product, trust, and deployment

- `guides/plans/roadmap/PROJECT_CONTEXT.md` — current deployment decisions and scope
  boundaries in the parent repository.
- `guides/plans/OPERATOR_NETWORK_ROADMAP.md` — permanent architecture
  boundaries and phased operator/network behavior.
- `../myscoutee-registry/guides/plans/project_context.md` from repository root
  when the sibling repository is checked out — fuller identity, trust, MAU,
  ledger, and exit model.
- `../myscoutee-registry/guides/plans/roadmap.md` — Registry milestones and
  protocol direction.

If the sibling repository is unavailable, do not claim cross-repository
verification. Use the parent summaries and report the missing boundary.

## Production and operations

- `guides/plans/roadmap/PRODUCTION_QUALIFICATION.md` — immutable candidate evidence,
  compatibility records, drills, load/security evidence, release decision.
- `packaging/README.md` — production build/package/install/update/TLS/backup
  contracts.
- `packaging/verify-deployment/README.md` — external read-only deployment
  verification boundary.
- `guides/manuals/README.md` and generated manuals — user/operator/admin
  behavior promised by released documentation.

## Test and runtime

- `e2e/README.md` — functional, stress, WebSocket, UI and UI-stress entrypoints
  and intended environments.
- `server/projects/profile/build.gradle` — Java toolchain, unit, qualification,
  and E2E task definitions.
- `frontend/package.json` and `frontend/angular.json` — supported frontend
  build/serve/test configurations.
- `server/docker-compose-dev.yml`, `server/docker-compose.e2e.yml`, and
  `packaging/compose/docker-compose.production.yml` — current runtime topology.

## Source precedence notes

- Generated manuals describe released user/operator behavior but do not
  override a newer explicit architecture decision without reconciliation.
- Roadmaps may include future deliverables. Confirm whether a statement is a
  permanent boundary, implemented behavior, or planned work.
- Tests prove implemented expectations only when their environment and fixture
  are valid.
- Git history explains intent and removals but never automatically outranks
  current canonical documents or the current user request.
