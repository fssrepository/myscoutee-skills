# MyScoutee system map

## Repository composition

```text
myscoutee-backend (parent Git repository)
├── frontend/                  Angular Git submodule
├── server/projects/profile/   Spring Boot application
├── server/docker/             development/E2E runtime and Mongo seeds
├── e2e/                       functional and stress harnesses
├── packaging/                 production images, DEB, workers, verification
├── guides/                    manuals, roadmaps, product/deployment context
└── tools/                     operator/release/development tooling

myscoutee-skills (sibling Git repository)
├── .agents/                   shared skills and trust library
├── instructions/              project entrypoints and shared rules
└── tools/trust/                trust validation, model runner, and eval suite

myscoutee-registry (sibling Git repository)
└── Go Registry, SQLite/protocol implementation, packaging and qualification
```

The frontend submodule has its own Git status and commit. A clean parent status
does not prove a clean frontend status, and a frontend commit does not update
the parent submodule pointer until the parent records it.

## Primary runtime paths

```text
Angular UI
  -> shared signal store
  -> base route/service contract
     -> local adapter -> in-memory graph -> IndexedDB      [explicit local]
     -> HTTP adapter -> local Java API -> Mongo/Redis/etc. [dev/E2E/prod]

Angular operator UI
  -> local Java operator API
  -> Java policy + local durable state/outbox
  -> configured external Go Registry
```

## State and authority boundaries

| State | Primary owner | Notes |
| --- | --- | --- |
| UI interaction state | Angular component/store | Components present; shared stores own cross-component state |
| Browser-local Explore data | shared/core local repositories | Explicit offline/local adapter only |
| Deployment application data | Java + Mongo | Profiles, chats, events, payments, branding |
| Transient coordination | Java + Redis where configured | Do not make Redis the durable source of truth |
| Media | Java/MinIO boundary | Preserve auth and lifecycle checks |
| Deployment Registry identity | Java host-persisted key/state | Private key never enters browser |
| Network accounting ledger | Go Registry | Append-only accepted history |
| Production update execution | fixed privileged host worker | Java stages signed fixed-schema request only |

## Environment intent

| Environment | Frontend source | Application data | Purpose |
| --- | --- | --- | --- |
| local/offline | local adapters | browser memory/IndexedDB | explicit browser-local exploration |
| dev HTTP | HTTP adapters | `demo_db` in current dev stack | realistic interactive development with demo data |
| E2E | HTTP adapters | isolated `e2e_db` | deterministic disposable verification |
| production authenticated | HTTP/session | production application DB | real operator/user data, no synthetic users |
| production Explore | HTTP/session | server-side `demo_db` + isolated demo Registry | packaged demo experience isolated from real operator Registry |

Verify current Compose/configuration before relying on this table; if runtime
code diverges, report the divergence rather than silently normalizing it.
