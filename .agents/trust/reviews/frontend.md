# Review: Angular frontend

## Responsibility path

Trace the change through the applicable layers:

```text
contracts -> base service/route selection -> local or HTTP adapter
-> mapper/repository -> shared signal store -> presentation component
```

When creating or materially changing a list/live-collection surface,
load [smart-list-live-surface.md](../patterns/smart-list-live-surface.md) before
implementing its behavior. A text-only edit does not trigger that card.

## Questions

- [ ] Is reusable or cross-component state in a shared store/service rather than
  a presentation component?
- [ ] Does the component avoid transport, retry, timeout, artificial delay,
  durable cache, and persistence policy?
- [ ] Are local and HTTP adapters implementing the same observable contract?
- [ ] Does the HTTP path avoid browser-local artificial route delay?
- [ ] Are mapping/default/clear semantics centralized and round-trip safe?
- [ ] Was an existing approved UI/workflow reused where the user asked for
  behavior “similar to” another flow?
- [ ] Are mobile overflow, scrolling, overlays, focus, and popup boundaries
  preserved rather than fixed by hiding content globally?
- [ ] Are loading, empty, error, stale, pending, and terminal states distinct?
- [ ] Are permissions and action visibility derived from authoritative role and
  state, not optimistic visual assumptions?
- [ ] Are all new/changed user-facing strings routed through i18n?

## Save/edit flows

Verify:

- create and reopen;
- change and reopen;
- clear/remove and reopen;
- local adapter and HTTP adapter when both are supported;
- nested definitions, images, optional fields, and default-off toggles where
  relevant.

An in-memory form update is not persistence proof.

## UI performance

- Frontend-local route delay emulates one service request. Start its necessary
  hydration, repository work and projection concurrently with that delay; publish
  only after both finish. Keep the established 1500 ms emulation and 3000 ms
  indicator window unless explicitly requested otherwise.
- One aggregate service operation owns one delay. Reuse the owner services'
  undelayed internal operations for its constituent work instead of calling
  multiple delayed public entry points. Keep permissions and persistence; do
  not remove required work just because it introduces another call.
- Diagnose service sequencing and main-thread work separately. Reuse the
  existing loading indicator; changing its animation cannot repair serial I/O
  or synchronous computation.
- Keep first-load/lazy-load boundaries intentional.
- Do not introduce eager imports to hide a stale-chunk/runtime problem.
- Use the correct optimized build when measuring bundle/render performance.
- Do not trade usability or required contrast/scrolling for a metric without
  evaluating the actual interaction.

## Optional references

Use [frontend-vertical-slice.md](../patterns/frontend-vertical-slice.md) when
creating or moving a service/adapter/store responsibility. Use
[ui-behavior-parity.md](../patterns/ui-behavior-parity.md) only when the task
asks one workflow to behave like another.
