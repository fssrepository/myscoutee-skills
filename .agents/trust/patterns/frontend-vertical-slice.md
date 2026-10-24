# Pattern: frontend vertical slice

Status: approved responsibility boundary.

## Shape

```text
contracts/*.interface.ts
  -> base service or route-mode facade
     -> local/source service -> mapper -> repository -> memory/IndexedDB
     -> http service -> local Java API
  -> shared/ui/context store
  -> feature component
```

The operator Registry slice is the clearest current reference because the
project context explicitly requires this layering.

## Questions before extending

1. Is the type an application contract, remote wire shape, local entity, or UI
   view model?
2. Do both local and HTTP implementations preserve the same observable result?
3. Is route selection centralized rather than decided by a component?
4. Does the store own request generation, busy/error state, and cross-component
   cache updates?
5. Does the component remain presentational and workflow-oriented?
6. Are remote-to-contract mappings explicit so Java/Go casing/status changes do
   not leak through the UI?

## Do not copy blindly

The operator service files are large and may contain domain-specific
complexity. Reuse their ownership split and test seams, not their size or every
mapping technique.

