# Pattern: Java domain slice

Status: approved responsibility boundary.

## Shape

```text
Spring controller + authorization
  -> request/response DTO
  -> owning service and domain invariants
  -> explicit mapper
  -> repository/document or guarded local store
```

Registry network operations add:

```text
durable intent/state -> canonical protocol -> bounded HTTP
-> response/signature verification -> durable receipt/evidence
```

## Questions before extending

1. Which service owns the invariant?
2. Which repository/document is authoritative?
3. Which derived parent/read fields must change with the mutation?
4. What authenticated principal and authority are required?
5. What is the DTO/domain/document distinction?
6. What is retry/idempotency behavior?
7. Does a mapper normalize transport only, or accidentally contain business
   policy?

## Reference caution

Use the operator Registry controller/service/mapper for layer boundaries. Do not
infer that every large existing service or repository shape is approved.

