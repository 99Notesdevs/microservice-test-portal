# test-microservice-backend implementation rules

## 1) Layering rules

- Routes wire HTTP → controller and attach auth/RBAC.
- Controllers validate input and shape responses.
- Services implement workflows.
- Repositories own Prisma, caching, and integrations.

## 2) Socket.IO rules

- Define a stable event contract (event names + payload shapes).
- Authenticate socket connections consistently with HTTP auth expectations.
- Avoid emitting sensitive data to rooms.

## 3) Kafka worker rules

- Kafka consumers must be idempotent where possible.
- Validate and sanitize consumed messages.
- Log processing failures with enough context to replay/debug.

## 4) Validation

- Validate all external input in controllers.
- Prefer Zod schemas.

## 5) Error handling

- Do not leak stack traces.
- Use consistent status codes (`400/401/403/404/500`).

## 6) Logging

- Use `src/utils/logger`.
- Avoid secrets and PII in logs.

## 7) Prisma

- Use a singleton Prisma client.
- Use transactions for multi-step writes.

## 8) Redis caching

- Redis is a mandatory platform dependency in this repo.
- Never use `flushall()` / `flushdb()`; always use targeted invalidation.
- Prefer targeted invalidation to global flush.
- Keep cache keys deterministic.

## 9) PR checklist

- Verify auth + RBAC on all write endpoints.
- Verify socket event access control.
- Verify Kafka consumers handle retries safely.
- Verify cache invalidation.
