# Rejected agent patterns

These are not necessarily forbidden product designs in every possible future;
they are rejected as implicit debugging or trust shortcuts.

| Rejected pattern | Why it failed | Interrupting question |
| --- | --- | --- |
| Alternate fallback when the primary route fails | Conceals the owner and creates divergent behavior | “Would this still be correct if the primary defect were fixed?” |
| Repair malformed seed/data inside Java services | Changes production behavior for a fixture problem and recurs | “Which canonical seed or migration owns this state?” |
| Restore old code because it once passed | Ignores intentional removal and current contract | “Why was it removed, and what current authority requires it?” |
| Broad refactor during a focused defect | Expands blast radius and makes review/undo unreliable | “Which line of the requested outcome requires this cleanup?” |
| Modify the working local adapter to match broken HTTP | Destroys the behavioral reference instead of finding the boundary | “Where do the two paths first diverge?” |
| Patch only the live dev database | Disappears on reset/import and leaves mutation bugs intact | “Will the next clean bootstrap reproduce the fix?” |
| Query-time projection for every menu badge | Repeats expensive work and hides write inconsistency | “Should the owning mutation maintain compact parent state?” |
| Start duplicate stack/build/browser without inspection | Wastes resources and can invalidate the user's runtime | “What is already running and what did the user authorize?” |
| Hide overflow by removing global scrolling/content | Trades one visual symptom for lost behavior/usability | “Which exact container owns clipping and what must remain scrollable?” |
| Treat one passing component test as end-to-end proof | Misses mapping, persistence, reload, retry, and environment boundaries | “Which complete loop did this test exercise?” |
| Keep changing after stop/no-edit/undo | Violates the active scope and increases recovery cost | “Has the user just changed the permitted action set?” |
