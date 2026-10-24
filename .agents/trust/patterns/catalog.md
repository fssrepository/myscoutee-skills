# Reference pattern catalog

Status meanings:

- `approved-boundary`: canonical docs approve the responsibility split. Copy
  structure selectively, not every implementation detail.
- `candidate`: useful current reference that still requires user/code review.
- `canonical-contract`: the referenced document defines the behavior.
- `do-not-copy`: known failure shape.

| Pattern | Status | Primary references | Approved aspect |
| --- | --- | --- | --- |
| Frontend operator vertical slice | approved-boundary | `frontend/src/app/shared/core/base/services/operator/operator-registry.service.ts`, `frontend/src/app/shared/core/http/services/operator/operator-registry.service.ts`, `frontend/src/app/shared/core/local/source/services/operator/operator-registry.service.ts`, `frontend/src/app/shared/ui/context/stores/operator/operator-registry.store.ts` | contract/route adapter/store/component ownership |
| Central route policy | approved-boundary | `frontend/src/app/shared/core/base/services/platform/route-delay.service.ts`, `frontend/src/app/shared/core/local/source/services/platform/route-delay.service.ts` | local artificial delay and HTTP timeout policy stay out of components |
| Browser seed graph | approved-boundary | `frontend/src/app/shared/core/local/seed/services/platform/demo-bootstrap.service.ts`, `frontend/src/app/shared/core/local/seed/repositories/operator/operator-registry-seed.repository.ts`, `frontend/src/app/shared/core/common/app.db.ts` | hydrate once, mutate one memory graph, flush completed steps |
| SmartList popup/live collection | approved-boundary | `frontend/components/src/lib/ui/components/core/smart-list/smart-list.component.ts`, `frontend/components/src/lib/ui/components/core/smart-list/smart-list.types.ts`, `frontend/components/src/lib/ui/scheduler/ui-task-scheduler.ts`, `frontend/src/app/shared/ui/components/notification-center-popup/notification-center-popup.component.ts` | preserve requested refresh behavior, use shared progress/polling, and reconcile visible insert/update/delete without default full reload |
| Java operator slice | approved-boundary | `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/controller/OperatorRegistryController.java`, `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/service/OperatorRegistryService.java`, `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/operator/mapper/OperatorRegistryMapper.java` | controller/service/mapper/repository responsibilities |
| Signed external operation | approved-boundary | `server/projects/profile/src/main/java/com/raxim/myscoutee/domain/registry/RegistryOperatorNetworkService.java`, `RegistryLocalStore.java`, `RegistryHttpClient.java`, `RegistryProtocol.java` in the same package | sign, send, verify, persist evidence; fail closed |
| Event checkout as related UI | candidate | `frontend/src/app/activity/components/event-checkout-popup/` and its shared/core event services | interaction/reference behavior only; adapt, do not clone blindly |
| Mutation-maintained event counters | candidate | `ActivitiesMembersService.java`, activity repositories/documents and their tests | compact parent/read state for high-frequency badges when transactional/idempotent |
| Immutable release qualification | canonical-contract | `guides/plans/PRODUCTION_QUALIFICATION.md`, `packaging/README.md` | exact artifacts and installed-host evidence |
| Component-local transport/delay/retry | do-not-copy | any occurrence | violates shared/core ownership |
| Repair seed/data in Java service | do-not-copy | historical repair patterns and session learnings | hides fixture/data defects and alters production behavior |
| Restore removed behavior from history | do-not-copy | old commits without current contract evidence | history does not authorize resurrection |

Before using a reference, state which row and which approved aspect applies.
