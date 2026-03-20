# test-microservice-backend inconsistencies backlog

## Mixed source-of-truth (TS + JS)

- `src/app.ts` and `src/app.js` both exist.
- `src/server.ts` and `src/server.js` both exist.

This increases drift risk; standardize on TypeScript sources only and ensure build output goes to `dist/`.

## Express version drift

- This service is on Express 4 while several other backends are on Express 5.

## TypeScript strictness

- Repo services differ on strictness; align later.

## CORS/header conventions

- Uses `Authorization` header in allowed headers (some services use `X-Auth-Type`).

## Boot behavior

- Kafka consumers start immediately at boot. Consider readiness/liveness strategy and failure handling across services.

## Redis safety

- One or more code paths use `flushall()` which is unsafe for shared Redis instances. Replace with targeted invalidation.

## Port conventions

- Default port (`5500`) differs from other backends.
