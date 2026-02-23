# Notion Widget Service — Project Context

## What is this?

"No-Auth Widget Studio" — 가입 없이, URL 하나로 완성하는 Notion 위젯 서비스.
수익 모델: "기능은 무료, 미학은 유료" (워터마크 제거, 프리미엄 테마/폰트 → Pro ₩6,500 일회성)

## Current State

- **Phase**: Phase 0 (제품화) — Sprint 0 완료
- **Monorepo**: Turborepo + pnpm 구성 완료
- **Widgets**: Flip Clock, Life Progress Bar (2종) → packages/widgets/에 추출 완료
- **Routes**: /embed/[widgetId] (SSG) + /notion/* (하위호환)
- **Build**: `pnpm build` 성공 (정적 export)

## Architecture (확정)

```
notion-widgets/  (Turborepo + pnpm)
├── apps/web/              # Next.js 15 (유일한 앱)
├── packages/api/          # tRPC router/ + service/ (비즈니스 로직 통합)
├── packages/widget-core/  # 위젯 타입, 레지스트리, 파라미터, 테마
├── packages/widgets/      # 개별 위젯 구현체
├── packages/db/           # Drizzle + Turso (Phase 1~)
├── packages/ui/           # 공유 UI 컴포넌트
└── tooling/               # typescript, eslint, prettier 공유 설정
```

### Key Patterns
- **URL = Single Source of Truth**: 위젯 커스터마이징은 전부 쿼리 파라미터
- **Widget Registry**: `registerWidget()` → 새 위젯 추가 시 4파일만 변경
- **Router → Service → DB**: router는 얇은 레이어, service에 비즈니스 로직
- **No Auth**: NextAuth 미사용. 라이선스 키 = 유일한 사용자 식별자
- **Lemon Squeezy**: MoR 결제 (사업자등록 불필요)

## Tech Stack

| Area | Tech |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| API | tRPC v11 |
| ORM | Drizzle ORM |
| DB | Turso (libSQL) — Phase 1~ |
| Payment | Lemon Squeezy |
| Monorepo | Turborepo + pnpm |
| Env validation | @t3-oss/env-nextjs |
| Deploy | Vercel |

## Key Documents

| File | Content |
|------|---------|
| `TECHNICAL_SPEC.md` | 전체 기술 설계서 (아키텍처, DB 스키마, API, 스프린트) |
| `BUSINESS_PLAN.md` | 사업 계획서 (수익모델, 로드맵, GTM) |
| `COMPETITIVE_ANALYSIS.md` | 경쟁사 분석 (Indify, WidgetBox, Apption) |
| `docs/decisions/` | 의사결정 로그 (ADR) |
| `docs/context/` | 세션별 진행 기록 |

## Sprint Plan

- ~~Sprint 0: 모노레포 마이그레이션 (1주)~~ ✅ 완료
- Sprint 1: 쿼리 파라미터 시스템 (1주) ← **다음**
- Sprint 2: 랜딩 페이지 MVP (1주)
- Sprint 3: 신규 위젯 (D-Day, 명언) (1주)
- Sprint 4-5: 결제 연동 (2주)

## Conventions

- Package scope: `@nw/` (notion-widgets)
- 한국어 UI 우선, 영어 UI Phase 2에서 추가
- service/ 디렉토리는 단수형 (canopy-mvp 컨벤션)
- 위젯 ID = URL 경로 (`/embed/{id}`)
