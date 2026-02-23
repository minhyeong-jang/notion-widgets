# ADR-004: Drizzle ORM 선택 (Prisma 대신)

**Date**: 2026-02-23
**Status**: Accepted

## Context

T3 기본은 Prisma이나, Turso(libSQL) + Edge 환경에서의 호환성 검토 필요.

## Decision

Drizzle ORM + Turso 선택.

## Rationale

| 항목 | Drizzle | Prisma |
|------|---------|--------|
| 번들 크기 | ~50KB | ~2MB |
| Edge 네이티브 | O | X (어댑터 필요) |
| Turso 공식 지원 | O | 제한적 |
| HTTP 네이티브 | O | X (커넥션 풀링 필요) |
| SQL 친화적 | O (SQL-like API) | X (자체 쿼리 언어) |

## Consequences

- canopy-mvp는 Prisma 사용하지만, 우리 규모와 Turso 조합에서는 Drizzle이 적합
- Phase 1에서 도입 (Phase 0에서는 DB 불필요)
