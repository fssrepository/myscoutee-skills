# Review: packaging, update, backup, restore, and release

## Candidate identity

Record exact package version/hash, bundled image references and IDs, source
commits, architecture, database/migration versions, and oldest supported source
package. Never substitute `latest` or a later source build.

## Questions

- [ ] Are production images/artifacts built from the intended source and
  included with exact identities?
- [ ] Are development, E2E, personal credentials, source maps, private keys,
  and disallowed seeds excluded?
- [ ] Are install/upgrade/remove/reinstall actions idempotent and preserving the
  documented operator data, TLS, identity, and volumes?
- [ ] Does the update path require explicit operator approval and independent
  package signature verification?
- [ ] Is Java unprivileged and limited to a fixed-schema staged request?
- [ ] Does the privileged worker reject unsafe names, paths, symlinks,
  mutation, wrong package metadata, and mismatched images?
- [ ] Is a complete backup required and verified before installation?
- [ ] Does interruption reconcile to accurate terminal state rather than false
  success?
- [ ] Is restore explicit, guarded, and binding matching Mongo/config keys and
  deployment/Registry state?
- [ ] Does packaged production Explore remain isolated from the real Registry?

## Qualification boundary

Source tests are not release qualification. Follow
`guides/plans/PRODUCTION_QUALIFICATION.md` for artifact preflight, automated
gates, oldest-supported upgrade/interruption/restore, public multi-Registry
isolation, load limits, security review, and evidence retention.

