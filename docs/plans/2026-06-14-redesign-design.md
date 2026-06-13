# Redesign Implementation Design

## Goal

`_redesign/` 프로토타입을 Next.js 코드베이스에 이식. 4개 페이지 전체 리디자인 + 통합 테마 시스템(ACCENT × MODE) + 위젯 시스템 테마 자동 감지 + E2E 검증.

## 핵심 결정사항

### 1. 통합 테마: ACCENT × MODE 2축
- `color-theme.ts` → 2축 분리 (ACCENTS 6개 × MODES 2개)
- 기존 `default` → `green`, `forest` 제거, `light` 제거 (모드로 분리됨)
- `resolveColors(accent?, mode?)` — accent 기본 green, mode 기본 prefers-color-scheme
- 사이트와 위젯이 같은 accent 시스템 공유

### 2. 위젯 임베드: 시스템 테마 자동 감지
- URL param: `accent=red` (mode param 없음)
- CSS 변수 + `@media (prefers-color-scheme)` 미디어쿼리로 모드 자동 전환
- 방문자 OS 설정에 따라 다크/라이트 자동 적용

### 3. 사이트 테마
- ThemeSwitcher: MODE 토글(해/달) + 6색 ACCENT dot
- `localStorage["nw-mode-v1"]` + `localStorage["nw-accent-v1"]`
- CSS transition은 transform/opacity만 (색 transition 금지)

### 4. 디자인 토큰
- 따뜻한 뉴트럴 (zinc → warm neutral)
- Pretendard + JetBrains Mono
- max-width 1080px, 카드 radius 14px

### 5. 페이지
- Home: Hero 2단 + Featured 6 + How it works + CTA
- Gallery: chip 필터 + 검색 + 4열 그리드
- Detail: 좌 프리뷰 + 우 컨트롤 + 하단 임베드 + 추천
- Feedback: 2단 폼 (신규)

### 6. 위젯 파라미터
- `colorTheme` → `accent` 리네이밍 (16개 위젯 전체)
- `style` 유지

### 7. 검증
- E2E: 모든 페이지 캡쳐 + 위젯 × accent × mode 조합 검증
- 빌드 통과 확인
