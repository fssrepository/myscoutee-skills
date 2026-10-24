# Review: demo, E2E, and production isolation

## Required environment matrix

Record affected behavior for:

| Mode | Frontend adapter | Java/Mongo | Registry | Synthetic state allowed? |
| --- | --- | --- | --- | --- |
| local/offline | local | no | browser-local only | yes |
| dev HTTP | HTTP | `demo_db` | configured dev/demo | yes |
| E2E | HTTP | `e2e_db` | disposable E2E | deterministic fixtures |
| production authenticated | HTTP/session | production DB | explicit external | no synthetic users |
| production Explore | HTTP/session | server `demo_db` | isolated internal demo | yes, isolated |

Verify actual configs before asserting the matrix.

## Questions

- [ ] Does a backend-connected session accidentally fall back to IndexedDB?
- [ ] Can the browser call the Go Registry directly?
- [ ] Can demo Registry identity/state/volume/port overlap the operator Registry?
- [ ] Does E2E mutate demo or production data?
- [ ] Does packaging include `e2e_db` when it should include only the curated
  demo and production-safe seed subsets?
- [ ] Does local artificial delay leak into HTTP mode?
- [ ] Are build optimization/debug differences acknowledged in measurements?
- [ ] Are profile, database, seed directory, and frontend configuration names
  aligned end to end?
- [ ] Does production startup depend on availability of an external Registry?

## Rename/config changes

For a profile or environment rename, search code, Compose, scripts, seeds,
tests, docs, CI, package templates, and generated paths. A partial rename is a
behavior defect; a broad rename still requires a reviewable, explicit file
inventory.

