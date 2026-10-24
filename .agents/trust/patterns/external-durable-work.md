# Pattern: durable external work

Status: approved for Registry delivery and privileged update orchestration.

## Shape

```text
validate local authority and configuration
-> persist immutable intent/request
-> derive canonical idempotency/signature material
-> attempt bounded external work
-> verify response/artifact independently
-> persist receipt/status/evidence
-> expose retry/reconcile without duplicate effect
```

## Failure questions

- What if the request is persisted but never sent?
- What if the peer accepts it and the response is lost?
- What if the process/host restarts at each boundary?
- What if the same idempotency key carries different content?
- What if the peer returns a validly encoded but wrongly signed/scoped result?
- What if local key, state, receipt, or backup pieces do not match?
- What terminal state prevents false success?

The browser may initiate an authorized operator action but does not receive
private keys or privileged execution capability.

