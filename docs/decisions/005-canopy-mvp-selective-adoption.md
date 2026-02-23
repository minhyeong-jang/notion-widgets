# ADR-005: canopy-mvp 패턴 선택적 채택

**Date**: 2026-02-23
**Status**: Accepted

## Context

사내 T3 프로젝트(canopy-mvp: 7 apps, 16 packages)를 참고하되 1인 프로젝트 규모에 맞게 조정.

## Adopted

| 패턴 | 적용 방식 |
|------|----------|
| `router/` + `service/` 2계층 | `packages/api/src/router/` + `service/` |
| `tooling/` 디렉토리 | `tooling/typescript/`, `eslint/`, `prettier/` |
| `@t3-oss/env-nextjs` | `apps/web/src/env.ts` |
| 단수형 `service/` | 컨벤션 통일 |

## Not Adopted

| 패턴 | 이유 |
|------|------|
| `packages/core/` (도메인 모델) | service/ 내에서 충분 |
| `packages/external/` (3rd party) | Lemon Squeezy 하나뿐 → service/ 내 처리 |
| TSyringe DI | 직접 import로 충분, 오버엔지니어링 |
| `packages/auth/` | No Sign-up 서비스 |
| 25개 모듈형 Prisma 스키마 | 5 테이블, 단일 파일로 충분 |
