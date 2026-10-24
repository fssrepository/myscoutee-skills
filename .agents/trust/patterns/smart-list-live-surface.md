# Pattern: SmartList-backed popup and live list

Status: approved MyScoutee interaction and state-management pattern.

## Trigger

Load this card whenever a task creates or materially changes a popup, dialog,
drawer, page surface, or nested section that contains a list, SmartList,
pageable collection, or periodically refreshed collection.

## Optional-capability boundary

Preserve existing refresh behavior and the requested scope. If exact reference
flow parity is requested, reuse its established behavior. Do not ask optional
polling/capability questions or silently add polling. Resolve ordinary choices
from the existing owner and project defaults; ask only for a genuine blocker
or a material, destructive or irreversible scope decision.

Stable identity, cancellation, cleanup, bounded requests, store/service ownership
and local/HTTP parity remain engineering responsibilities. Apply the progress
and polling sections only to behavior in scope.

## Project-first implementation

- Start with the shared `app-smart-list` and its existing loaders, converters,
  state events, progress indicator, polling, caching, sorting, and visible-item
  APIs. Use custom list infrastructure only for a proven incompatible contract.
- Keep transport and shared collection state in the owning service/store. The
  popup owns presentation and user interaction, not a parallel polling/cache
  implementation.
- Define stable item identity and ordering. Preserve scroll, selection, active
  menus, pagination window, and already usable content across background work.
- Distinguish initial loading, blocking mutation, background refresh, empty,
  stale, error, and overdue states.

## Reconcile mutations without reloading the list

After a successful create/update/delete, apply the canonical returned state to
the visible SmartList instead of calling its loader again by default:

| Mutation | Preferred SmartList operation |
| --- | --- |
| update visible item | `patchVisibleItem` or `patchConvertedVisibleItem` |
| create or update by identity | `upsertConvertedVisibleItem` |
| insert already converted item | `reinsertVisibleItem` |
| delete/remove | `removeVisibleItemByIdentity` or `removeVisibleItems` |
| reconcile a polled/current window | `syncVisibleItems` |
| replace a known local window | `replaceVisibleItems` |

When the repository already exposes a matching operation, name the concrete
SmartList API in the plan or review before implementation. Generic wording such
as "patch/remove the visible row" is not enough: it leaves open whether the
shared API will be reused or a parallel collection mechanism will be invented.

“In place” means reconciling the rendered collection without another full
network/storage load. It does not require mutating Angular objects or arrays in
place; preserve OnPush-friendly immutable updates.

A full `reload()` requires a stated reason, such as a changed query/scope, an
invalidated cursor/snapshot, unknown membership or ordering outside the loaded
window, or a mutation response that cannot provide canonical list state. First
check whether stable identity, returned data, visible-range rules, and a total
adjustment are sufficient. Do not reload merely because it is convenient.

## Progress behavior

- Use SmartList's built-in `headerProgress`/indicator for initial or explicitly
  visible loading rather than adding a competing popup spinner.
- Decide `showBackgroundLoadingProgress` separately. A scheduled poll should
  normally preserve usable content and avoid blocking/flickering the surface.
- Configure loading delay/window when the interaction needs it; do not show a
  flash for work that completes below the established quick threshold.
- A failed background refresh must not erase the last usable list or claim that
  stale data is current.

## Scheduled polling

- Use SmartList `pollIntervalMs`, which delegates to the shared
  `UiTaskScheduler`; do not create a component-local `setInterval` loop.
- Poll only the visible/current query window and reconcile it with
  `syncVisibleItems`; do not reset pagination or reload every page.
- Preserve the scheduler's non-overlap, abort, query-generation, and destroy
  semantics. A close/destroy must not leave background work running.
- Put a shared interval/freshness policy in the owning service/store; a truly
  surface-specific interval may remain in the SmartList configuration.
- Verify server load and client request volume at the selected interval. A
  live-looking popup is not permission for unbounded polling.

## Project references

- Core APIs and lifecycle:
  `frontend/components/src/lib/ui/components/core/smart-list/smart-list.component.ts`
  and `smart-list.types.ts` in the same directory.
- Poll scheduling:
  `frontend/components/src/lib/ui/scheduler/ui-task-scheduler.ts`.
- Poll + progress + in-place notification updates:
  `frontend/src/app/shared/ui/components/notification-center-popup/notification-center-popup.component.ts`.
- Polling SmartList popup:
  `frontend/src/app/asset/components/asset-popup/asset-popup.component.ts`.
- Patch examples:
  `frontend/src/app/asset/components/asset-availability-popup/asset-availability-popup.component.ts`.
- Ordered remove/patch/reinsert example:
  `frontend/src/app/operator/components/operator-page/operator-page.component.ts`.

These references approve the shared primitive and reconciliation shape, not
every feature, interval, query, or visual choice in those components.

## Proof

- Prove initial progress and the selected background-progress behavior.
- For create/update/delete, assert the visible item/total/order changes and the
  page loader is not called again unless the documented reload exception holds.
- For polling, prove the selected interval/configuration, current-window merge,
  absence of overlapping work, and teardown/abort behavior.
- Exercise filtering/sorting cases where a mutation moves an item into or out
  of the visible window.
- Verify the relevant local and HTTP paths when both are supported.
