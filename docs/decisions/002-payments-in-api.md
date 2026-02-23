# ADR-002: 결제 로직을 api 패키지에 통합

**Date**: 2026-02-23
**Status**: Accepted

## Context

초기 설계에서 `packages/payments/`를 별도 패키지로 분리했으나, 1인 프로젝트에서 패키지 간 의존성 복잡도가 불필요하게 높아짐.

## Options Considered

1. `packages/payments/` 별도 유지 → `api → payments → db` (2단계 체인)
2. `packages/api/src/service/`에 통합 → `api → db` (1단계 체인)

## Decision

Option 2 채택. `packages/api/src/service/lemonsqueezy.ts`, `service/license.ts`로 통합.

## Rationale

- 1인 프로젝트에서 패키지 분리의 이점 < 관리 비용
- canopy-mvp도 동일한 `router/ + service/` 패턴 사용
- 규모 커지면 그때 분리해도 service/ 내에서 파일 이동만으로 가능
