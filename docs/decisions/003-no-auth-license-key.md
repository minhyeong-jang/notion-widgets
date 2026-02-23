# ADR-003: No Sign-up + 라이선스 키 모델

**Date**: 2026-02-23
**Status**: Accepted

## Context

경쟁사(Indify, WidgetBox)는 위젯 생성 전 회원가입 필수. "제로 프릭션" 차별화 필요.

## Decision

- NextAuth 미사용, users 테이블 없음
- 위젯 커스터마이징: URL 쿼리 파라미터만으로 완결
- 유료 기능: Lemon Squeezy에서 이메일만 입력 → 라이선스 키 발급 → URL에 `?license=XXXXX` 추가
- 관리자 인증: 환경변수 ADMIN_API_KEY (Phase 2 이후 GitHub OAuth 가능)

## Consequences

- 라이선스 키 = 유일한 사용자 식별자
- DB에 users 테이블 불필요 → 스키마 단순화
- Lemon Squeezy가 고객 관리(이메일, 결제 이력) 담당
