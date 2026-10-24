# Review: cross-repository and cross-process change

## Inventory

List every affected repository/process and its current commit/worktree status:

```text
parent backend:
frontend submodule:
sibling Go Registry:
packaged/generated artifact:
```

## Questions

- [ ] Is there one explicit canonical owner for each concept and wire field?
- [ ] Are frontend TypeScript, Java DTO, Java protocol, Go protocol, persistence,
  and docs changed where required—without duplicating authority?
- [ ] Is compatibility with older/newer peer versions defined?
- [ ] Are serialization, nullability, casing, numeric units, time zone, ordering,
  cursor, and hash/signature semantics identical?
- [ ] Are generated artifacts rebuilt from sources rather than hand-edited?
- [ ] Are submodule commit and parent pointer changes reported separately?
- [ ] Are commits available for both sides before claiming completion?
- [ ] Does the test actually run the changed sides together?

## Missing sibling rule

If the sibling repository is unavailable, perform safe local work but mark
cross-repository proof `NOT PROVEN`. Do not invent its current schema or claim
interoperability from a local mock alone.

