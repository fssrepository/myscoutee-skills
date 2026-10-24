# Review: security, privacy, and authority

## Data classification

Identify every touched value as public, authenticated, operator-only,
deployment-secret, Registry-secret, personal data, consent evidence, audit
evidence, or build/release trust material.

## Questions

- [ ] Is authentication verified rather than accepting a caller-supplied UID?
- [ ] Is external identity scoped by provider, issuer, and subject?
- [ ] Does authorization distinguish user, admin/moderator, operator, Registry
  administrator, and privileged host worker?
- [ ] Does the browser receive only public/masked secret metadata?
- [ ] Are raw identifiers/tokens excluded from public ledger, logs, URLs, seed,
  package, and frontend state?
- [ ] Is member consent explicit and versioned for global identity linking?
- [ ] Are request sizes, paths, redirects, timeouts, TLS, and rate boundaries
  fail-closed?
- [ ] Can untrusted Registry/announcement/browser data become a shell command,
  arbitrary host path, package trust root, or privileged worker instruction?
- [ ] Are key creation, custody, rotation, backup, restore, and mismatch failure
  defined?
- [ ] Are audit records append-only and useful without exposing prohibited data?

## Trust statements

Do not overclaim cryptography. State separately what a signature proves, what
the operator-controlled deployment can falsify, and what independent audit or
business policy must address.

## Evidence

Include negative-path tests for wrong authority, issuer/scope, signature,
nonce/idempotency, unsafe path, oversized input, missing consent, mismatched
key/state, and unavailable dependencies where relevant.

