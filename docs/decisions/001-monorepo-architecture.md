# ADR-001: 모노레포 아키텍처 선택

**Date**: 2026-02-23
**Status**: Accepted

## Context

기존 Next.js 단일 앱에서 위젯 서비스로 확장하면서 코드 분리 필요.

## Decision

- Turborepo + pnpm 모노레포
- T3(create-t3-turbo) 패턴 기반
- canopy-mvp 프로젝트 구조 참고 (선택적 채택)

## Consequences

- 5 packages: api, widget-core, widgets, db, ui
- tooling/ 디렉토리로 공유 설정 분리
- 앱은 얇은 래퍼, 패키지가 비즈니스 로직
