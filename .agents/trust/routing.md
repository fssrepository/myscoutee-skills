# Trust routing

The [kernel routing table](kernel.md#standard-routing) is the single card-selection
source for standard and deep tasks. Do not maintain a second trigger table here.
Read only cards for the behavior being investigated or changed; a linked file
is not automatically another required read. Reuse cards already in context.

For deep work, also apply the kernel's deep-loading list and
[risk model](risk-model.md). Use [environment isolation](patterns/environment-isolation.md)
when changing state isolation, [write-time derived state](patterns/write-time-derived-state.md)
when selecting a projection design, and [durable work](patterns/external-durable-work.md)
when changing external operation durability. These are conditional references,
not a checklist for unrelated work.

Completion follows the kernel: its compact check suffices for narrow mechanical
changes; behavior, cross-boundary or high-risk work uses
[completion review](reviews/completion.md). Deep mode includes that review.
Routing notes and templates are optional working aids, not required artifacts.
