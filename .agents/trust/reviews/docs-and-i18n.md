# Review: documentation and internationalization

## User-facing text

- [ ] All new/changed UI labels, notices, errors, statuses, and accessibility
  text use the central i18n path.
- [ ] English and Hungarian bundles/seeds stay key- and placeholder-compatible.
- [ ] Placeholders such as `{rule}` are rendered rather than leaked literally.
- [ ] Domain terms are consistent across menu, popup, audit/history, manuals,
  and API semantics.
- [ ] Required/optional, pending/accepted/declined, current/historical, and
  operator/product branding distinctions remain clear.

## Documentation authority

- [ ] The document is labeled as current behavior, future roadmap, manual,
  recovery procedure, or qualification requirement.
- [ ] Commands use exact current paths/profiles and state whether they mutate
  hosts or data.
- [ ] Security/trust claims state limitations and do not imply impossible proof.
- [ ] Version numbers, artifact links, generated PDF/PPTX outputs, and source
  files remain aligned when in scope.
- [ ] Trust cards link to canonical sources rather than copying them.

## Proof

Run relevant i18n seed audits/builds and documentation generators when their
sources change. A source Markdown edit alone does not update a committed
generated manual or presentation.
