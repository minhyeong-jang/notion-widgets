# Sprint 1-3 설계서: 랜딩 + 커스터마이저 + 신규 위젯

## 팀 구성 (6명)

| 역할 | 담당 |
|------|------|
| Team Lead | 조율, 아키텍처, 태스크 분배, 코드 통합 |
| Frontend Designer | 랜딩 페이지 (히어로, 갤러리, 사용법, 푸터) |
| Customizer Dev | 커스터마이저 패널, 컨트롤, 프리뷰, URL 생성기 |
| Widget Core Engineer | params 확장, 테마 시스템, ControlDefinition, buildEmbedUrl |
| Widget Builder | D-Day, 명언, 포모도로, 아날로그 시계 (4종) |
| Code Reviewer | 코드 리뷰, 빌드 검증, 통합 테스트 |

## 실행 전략: 웨이브 기반

### Wave 1 (기반, 직렬)
- Widget Core: ControlDefinition 타입 확장, 테마 시스템, buildEmbedUrl, 기존 위젯 controls[] 추가

### Wave 2 (핵심, 병렬 4트랙)
- 트랙 A: 랜딩 페이지 (frontend-design 스킬)
- 트랙 B: 커스터마이저 UI (frontend-design 스킬)
- 트랙 C: 신규 위젯 4종 (worktree 격리)
- 트랙 D: 테마 구현 + 통합 지원

### Wave 3 (통합/검증)
- 전체 코드 리뷰, pnpm build 검증, E2E 동작 확인

## 위젯 목록 (6종)

| 위젯 | 상태 | 카테고리 |
|------|------|---------|
| Flip Clock | 기존 | time |
| Life Progress | 기존 | productivity |
| D-Day 카운트다운 | 신규 | time |
| 명언 | 신규 | lifestyle |
| 포모도로 타이머 | 신규 | productivity |
| 아날로그 시계 | 신규 | time |

## 페이지 구조

- `/` → 랜딩 (히어로 + 갤러리 + 사용법 + 비교 + 푸터)
- `/widget/[id]` → 커스터마이저 (컨트롤 + 라이브 프리뷰 + URL 복사)
- `/embed/[id]` → 위젯 렌더 (Notion iframe용, 기존)

## 테마 시스템

- Default (무료): #7fb686 그린 + 다크
- Light (무료): 밝은 배경 + 소프트 그레이
- Glassmorphism (잠금): 반투명 블러
- Retro (잠금): 앰버/터미널
- Neon (잠금): 네온 글로우

## 스킬 사용 계획

- brainstorming → writing-plans → frontend-design
- dispatching-parallel-agents, subagent-driven-development
- test-driven-development (위젯), verification-before-completion

---
*Created: 2026-03-01*
