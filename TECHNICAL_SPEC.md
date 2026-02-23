# Notion 위젯 서비스 기술 설계서 (Technical Specification)

## 1. 기술 스택 확정

| 영역 | 기술 | 근거 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | 현재 사용 중, 유지 |
| 언어 | TypeScript 5 | 현재 사용 중, 유지 |
| 스타일링 | Tailwind CSS 4 | 현재 사용 중, 유지 |
| API | tRPC v11 (전체 통합) | 위젯/관리자 모두 tRPC. 패키지로 분리하여 앱 독립적 |
| ORM | Drizzle ORM | Edge 네이티브, 경량 번들(~50KB), Turso 최적 궁합 |
| DB | Turso (libSQL) | 무료 9GB, HTTP 네이티브, 서버리스 커넥션 풀링 불필요 |
| 결제 | Lemon Squeezy | MoR, 사업자 불필요, 라이선스 키 내장 |
| 모노레포 | Turborepo + pnpm | T3 생태계 표준 |
| 배포 (위젯) | Vercel | 위젯+랜딩 통합 |
| 배포 (API) | Vercel Serverless | 무료 Hobby 플랜 |
| 스키마 검증 | Zod | 타입 + 런타임 검증 통합 |
| 환경변수 | @t3-oss/env-nextjs | T3 표준, apps/web/src/env.ts에서 검증 |
| CI/CD | GitHub Actions + Vercel | PR시 lint+typecheck, main push시 배포 |

### T3 스택 채택/제외 판단

| T3 요소 | 채택 | 근거 |
|---------|------|------|
| Next.js | O | 유지 |
| TypeScript | O | 유지 |
| Tailwind | O | 유지 |
| tRPC | O (Phase 1~) | packages/api에서 라우터 정의, 앱은 래퍼만 |
| Drizzle | O (Phase 1) | Prisma 대신 선택 (Edge 호환, 경량) |
| **NextAuth** | **X** | "No Sign-up" 서비스이므로 사용자 인증 불필요 |
| Turborepo | O | 모노레포 필수 |

---

## 2. 모노레포 구조

### 핵심 원칙: 앱은 얇은 래퍼, 패키지가 비즈니스 로직

T3(create-t3-turbo) 패턴에 따라 **API/결제/DB 로직을 전부 패키지로 분리**합니다.
앱의 API Route Handler는 5~10줄짜리 진입점만 담당합니다.

> **참고**: canopy-mvp(사내 T3 프로젝트)의 `router/` + `service/` 패턴, `tooling/` 디렉토리 구조를 선택적으로 채택.
> 단, DI(TSyringe), `packages/core/`, `packages/external/` 등은 1인 프로젝트 규모에 불필요하여 제외.

```
notion-widgets/
├── turbo.json
├── package.json                          # pnpm workspaces
├── pnpm-workspace.yaml
│
├── apps/
│   └── web/                              # Next.js 15 (유일한 앱)
│       ├── next.config.ts
│       ├── package.json
│       └── src/
│           ├── app/
│           │   ├── layout.tsx            # 루트 레이아웃
│           │   ├── globals.css
│           │   ├── page.tsx              # 랜딩 페이지 (위젯 갤러리)
│           │   ├── widget/
│           │   │   └── [widgetId]/
│           │   │       └── page.tsx      # 위젯별 커스터마이저
│           │   ├── embed/
│           │   │   ├── layout.tsx        # embed 전용 최소 레이아웃
│           │   │   └── [widgetId]/
│           │   │       └── page.tsx      # 위젯 렌더러 (Notion iframe용)
│           │   ├── admin/                # 관리자 대시보드 (Phase 2)
│           │   │   ├── layout.tsx        # 관리자 인증 체크
│           │   │   ├── page.tsx          # 통계 오버뷰
│           │   │   └── licenses/
│           │   │       └── page.tsx      # 라이선스 목록/관리
│           │   └── api/                  # ★ 얇은 래퍼만 (5~10줄)
│           │       ├── trpc/[trpc]/
│           │       │   └── route.ts      # tRPC 어댑터 래퍼
│           │       └── webhooks/
│           │           └── lemonsqueezy/
│           │               └── route.ts  # 서명 검증 → service 위임
│           ├── trpc/
│           │   ├── react.tsx             # tRPC React client (Provider)
│           │   └── server.ts             # tRPC server helpers (RSC용)
│           ├── components/
│           │   ├── landing/              # 히어로, 갤러리, 푸터
│           │   ├── customizer/           # 커스터마이저 패널 + 컨트롤
│           │   │   ├── customizer-panel.tsx
│           │   │   ├── controls/         # color-picker, select, toggle, slider, date-picker
│           │   │   ├── preview-frame.tsx
│           │   │   └── url-generator.tsx
│           │   └── shared/
│           │       ├── watermark.tsx
│           │       └── theme-provider.tsx
│           ├── hooks/
│           │   └── use-widget-params.ts
│           └── env.ts                    # @t3-oss/env-nextjs 환경변수 검증
│
├── packages/
│   ├── api/                              # ★ tRPC 라우터 + 비즈니스 로직 통합
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts                  # appRouter + createTRPCContext export
│   │       ├── root.ts                   # 라우터 머지
│   │       ├── trpc.ts                   # context, publicProcedure, adminProcedure
│   │       ├── router/                   # tRPC 라우터 (얇은 레이어, service 호출만)
│   │       │   ├── license.ts            # verify, list, revoke, getByEmail
│   │       │   ├── widget.ts             # trackView, getStats
│   │       │   ├── weather.ts            # getWeather (프록시)
│   │       │   └── admin.ts              # overview, dailyStats, webhookLogs
│   │       └── service/                  # 비즈니스 로직 (순수 함수, Next.js 무의존)
│   │           ├── license.ts            # 키 검증, 활성화/비활성화, 만료 체크
│   │           ├── lemonsqueezy.ts       # 웹훅 처리, 체크아웃 URL, 서명 검증
│   │           └── weather.ts            # 캐싱 프록시
│   │
│   ├── widget-core/                      # 위젯 시스템 핵심 (타입, 레지스트리, 파라미터, 테마)
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types.ts                  # WidgetDefinition, ThemeDefinition, ControlDefinition
│   │       ├── registry.ts               # registerWidget, getWidget, getAllWidgets
│   │       ├── params.ts                 # parseWidgetParams, buildEmbedUrl
│   │       └── theme.ts                  # themes, resolveThemeVariables
│   │
│   ├── widgets/                          # 개별 위젯 구현체
│   │   ├── package.json
│   │   └── src/
│   │       ├── flip-clock/
│   │       │   ├── index.ts              # WidgetDefinition (메타 + 컴포넌트 + 스키마)
│   │       │   ├── flip-clock.tsx
│   │       │   ├── flip-card.tsx
│   │       │   ├── schema.ts             # Zod 파라미터 스키마
│   │       │   └── styles.css
│   │       ├── life-progress/
│   │       │   ├── index.ts
│   │       │   ├── life-progress.tsx
│   │       │   ├── progress-bar.tsx
│   │       │   └── schema.ts
│   │       ├── countdown/                # Phase 1
│   │       ├── quote/                    # Phase 1
│   │       └── index.ts                  # 모든 위젯 등록
│   │
│   ├── db/                               # Drizzle + Turso (Phase 1~)
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── schema.ts                # 단일 스키마 파일 (5 테이블)
│   │       └── client.ts                # Drizzle + Turso 클라이언트
│   │
│   └── ui/                               # 공유 UI 컴포넌트
│       ├── package.json
│       └── src/
│           ├── index.ts
│           ├── button.tsx
│           ├── copy-button.tsx
│           └── card.tsx
│
└── tooling/                              # ★ 공유 설정 (canopy-mvp 패턴 채택)
    ├── typescript/                        # 공유 TS 설정
    │   ├── base.json
    │   ├── nextjs.json
    │   └── react-library.json
    ├── eslint/                            # 공유 ESLint 설정
    │   ├── package.json
    │   └── base.js
    └── prettier/                          # 공유 Prettier 설정
        ├── package.json
        └── index.js
```

### 앱 vs 패키지 역할 분리

| 위치 | 역할 | 예시 |
|------|------|------|
| `apps/web/api/` | 얇은 진입점 (5~10줄) | tRPC 어댑터, 웹훅 서명 검증 |
| `packages/api/router/` | tRPC 라우터 (얇은 레이어) | license.verify → service 호출 |
| `packages/api/service/` | 비즈니스 로직 (순수 함수) | 웹훅 처리, 키 검증, 캐싱 |
| `packages/db/` | 스키마 + DB 클라이언트 | Drizzle 테이블, Turso 연결 |
| `packages/widget-core/` | 위젯 타입/레지스트리 | WidgetDefinition, parseParams |
| `packages/widgets/` | 위젯 구현체 | FlipClock, LifeProgress |

### 패키지 의존성 흐름

```
apps/web
  ├── @nw/api          # tRPC 라우터 + 비즈니스 로직
  ├── @nw/widget-core  # 위젯 타입/레지스트리
  ├── @nw/widgets      # 위젯 구현체
  └── @nw/ui           # 공유 UI

packages/api
  └── @nw/db           # DB (유일한 의존성, 1단계 체인)

packages/widgets
  └── @nw/widget-core  # 타입만 사용

packages/widget-core
  └── zod              # 스키마 검증
```

비즈니스 로직(`api/service/`)은 Next.js에 의존하지 않는 순수 TypeScript.
앱이 바뀌어도(Expo, Hono 등) 패키지는 그대로 재사용 가능.

### 라우트 분리

- `/embed/*` — Notion iframe에 임베드 (최소 레이아웃, 폰트/헤더 없음)
- `/` — 랜딩 페이지, 갤러리, 커스터마이저
- `/admin/*` — 관리자 대시보드 (라이선스 관리, 통계)
- `/api/trpc/*` — tRPC 엔드포인트 (래퍼)
- `/api/webhooks/*` — 외부 웹훅 수신 (래퍼)

Next.js App Router의 자동 코드 스플리팅으로 embed 번들에 랜딩/관리자 코드가 포함되지 않습니다.

---

## 3. DB 필요 여부 & 도입 시점

| 기능 | DB 필요 | Phase |
|------|---------|-------|
| 위젯 렌더링/커스터마이징 | **불필요** (URL 파라미터) | 0 |
| 워터마크 표시 | **불필요** (클라이언트) | 0 |
| 랜딩 페이지/커스터마이저 | **불필요** (정적) | 0 |
| 라이선스 키 검증 | **필요** | 1 |
| 결제 웹훅 처리 | **필요** | 1 |
| 날씨 API 프록시 캐싱 | **필요** | 2 |
| 위젯 사용 통계 | **필요** | 2 |
| 관리자 대시보드 | **필요** | 2 |

**결론**: Phase 0에서는 DB 없이. Phase 1(결제 도입)에서 Turso 도입.

---

## 4. DB 스키마 (Drizzle + Turso)

```typescript
// packages/db/src/schema.ts

// 1. 라이선스 테이블
export const licenses = sqliteTable("licenses", {
  id:                      text("id").primaryKey(),
  licenseKey:              text("license_key").notNull().unique(),
  lemonSqueezyOrderId:     text("lemonsqueezy_order_id").notNull(),
  lemonSqueezyCustomerId:  text("lemonsqueezy_customer_id"),
  lemonSqueezyProductId:   text("lemonsqueezy_product_id").notNull(),
  customerEmail:           text("customer_email").notNull(),
  plan:                    text("plan", { enum: ["lifetime", "monthly", "yearly"] }).notNull(),
  status:                  text("status", { enum: ["active", "expired", "cancelled", "refunded"] }).notNull().default("active"),
  maxActivations:          integer("max_activations").notNull().default(5),
  currentActivations:      integer("current_activations").notNull().default(0),
  createdAt:               text("created_at").notNull().default(sql`(datetime('now'))`),
  expiresAt:               text("expires_at"),
});

// 2. 라이선스 활성화 (위젯 인스턴스 추적)
export const licenseActivations = sqliteTable("license_activations", {
  id:              text("id").primaryKey(),
  licenseId:       text("license_id").notNull().references(() => licenses.id),
  instanceId:      text("instance_id").notNull(),
  widgetType:      text("widget_type").notNull(),
  activatedAt:     text("activated_at").notNull().default(sql`(datetime('now'))`),
  lastVerifiedAt:  text("last_verified_at").notNull().default(sql`(datetime('now'))`),
});

// 3. 위젯 사용 통계 (Phase 2)
export const widgetAnalytics = sqliteTable("widget_analytics", {
  id:                 text("id").primaryKey(),
  widgetType:         text("widget_type").notNull(),
  date:               text("date").notNull(),
  impressions:        integer("impressions").notNull().default(0),
  uniqueInstances:    integer("unique_instances").notNull().default(0),
  customizationStats: text("customization_stats"), // JSON
});

// 4. 웹훅 이벤트 로그
export const webhookEvents = sqliteTable("webhook_events", {
  id:           text("id").primaryKey(),
  source:       text("source").notNull().default("lemonsqueezy"),
  eventType:    text("event_type").notNull(),
  payload:      text("payload").notNull(),
  status:       text("status", { enum: ["received", "processed", "failed"] }).notNull().default("received"),
  errorMessage: text("error_message"),
  createdAt:    text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 5. API 캐시 (날씨 등)
export const apiCache = sqliteTable("api_cache", {
  cacheKey:     text("cache_key").primaryKey(),
  responseData: text("response_data").notNull(),
  expiresAt:    text("expires_at").notNull(),
});
```

**핵심**: `users` 테이블 없음. "No Sign-up" 서비스이므로 라이선스 키 = 유일한 사용자 식별자.

---

## 5. 위젯 시스템 아키텍처

### 핵심 타입 (`packages/widget-core/src/types.ts`)

```typescript
export interface WidgetDefinition<TParams extends Record<string, unknown>> {
  id: string;                           // URL 경로: /embed/{id}
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  thumbnail: string;
  category: "time" | "productivity" | "lifestyle" | "utility";
  recommendedSize: { width: number; height: number };
  paramsSchema: z.ZodType<TParams>;     // Zod 스키마
  defaultParams: TParams;
  controls: ControlDefinition[];        // 커스터마이저 UI 자동 생성용
  component: ComponentType<{ params: WidgetParams<TParams> }>;
  isPremium?: boolean;
}

export interface ControlDefinition {
  key: string;
  label: string;
  labelKo: string;
  type: "color" | "select" | "toggle" | "slider" | "date" | "text";
  defaultValue: unknown;
  options?: Array<{ value: string; label: string }>;
  isPremium?: boolean;
  group?: "appearance" | "content" | "advanced";
}
```

### 위젯 레지스트리 패턴

```typescript
// packages/widget-core/src/registry.ts
const registry = new Map<string, WidgetDefinition>();

export function registerWidget(def: WidgetDefinition): void;
export function getWidget(id: string): WidgetDefinition | undefined;
export function getAllWidgets(): WidgetDefinition[];
export function getWidgetIds(): string[];
```

### 새 위젯 추가 시 변경 파일: 정확히 4개

```
1. [신규] packages/widgets/src/{name}/schema.ts      — Zod 스키마
2. [신규] packages/widgets/src/{name}/{name}.tsx      — React 컴포넌트
3. [신규] packages/widgets/src/{name}/index.ts        — WidgetDefinition
4. [수정] packages/widgets/src/index.ts               — 1줄 추가: registerWidget(...)
```

라우터, 갤러리, generateStaticParams 모두 레지스트리에서 동적으로 가져오므로 추가 변경 불필요.

---

## 6. 테마 시스템

CSS 변수 기반. 테마 선택 → CSS 변수 주입 → 사용자 오버라이드 적용.

| 테마 | 무료/유료 |
|------|----------|
| Default (#7fb686) | 무료 |
| Dark (#1a1a2e) | 무료 |
| Glassmorphism | 유료 |
| Retro | 유료 |
| Neon | 유료 |

```typescript
// 테마 변수 → CSS 변수로 주입
interface ThemeVariables {
  "--widget-bg": string;
  "--widget-text": string;
  "--widget-accent": string;
  "--widget-radius": string;
  "--widget-padding": string;
}
```

---

## 7. 상태 관리: URL = Single Source of Truth

```
사용자 인터랙션 → onParamChange(key, value)
  → router.replace(/widget/{id}?{serialize(params)})
    → useSearchParams() 변경 감지
      → parseWidgetParams(searchParams)
        ├→ CustomizerPanel (UI 반영)
        ├→ PreviewFrame iframe (실시간 미리보기)
        └→ UrlGenerator (복사 URL)
```

- 별도 상태 라이브러리 불필요 (zustand/jotai 없음)
- 새로고침해도 상태 유지
- URL 공유 = 설정 공유

---

## 8. API 설계 (tRPC 통합 + 웹훅 래퍼)

### 아키텍처: 앱은 래퍼, 패키지가 로직

```
apps/web/api/trpc/route.ts         → 5줄 래퍼 → packages/api/router/ (tRPC 라우터)
apps/web/api/webhooks/route.ts     → 서명 검증만 → packages/api/service/lemonsqueezy.ts
```

### tRPC 라우터 (packages/api/src/router/) → service 호출

| Router | Procedure | 접근 | 용도 | Phase |
|--------|-----------|------|------|-------|
| **license** | verify | public | 위젯에서 라이선스 키 검증 | 1 |
| | list | admin | 라이선스 목록 조회 | 2 |
| | getByEmail | admin | 이메일로 라이선스 검색 | 2 |
| | revoke | admin | 라이선스 취소 | 2 |
| **widget** | trackView | public | 위젯 조회 기록 | 2 |
| | getStats | admin | 위젯별 사용 통계 | 2 |
| **weather** | get | public | 날씨 API 프록시 (캐싱) | 2 |
| **admin** | overview | admin | 매출/사용자/위젯 통계 종합 | 2 |
| | dailyStats | admin | 일별 트렌드 | 2 |
| | webhookLogs | admin | 웹훅 이벤트 로그 조회 | 2 |

### 웹훅 (apps/web, 래퍼만)

| Method | 경로 | 앱에서 하는 일 | 위임 대상 |
|--------|------|--------------|----------|
| POST | `/api/webhooks/lemonsqueezy` | HMAC 서명 검증만 | `@nw/api` service/lemonsqueezy.ts handleWebhook() |

### 관리자 인증

```typescript
// packages/api/src/trpc.ts
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  const apiKey = ctx.headers.get("x-admin-key");
  if (apiKey !== process.env.ADMIN_API_KEY) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx });
});
```

NextAuth 불필요. 환경변수 기반 API Key → Phase 2 이후 필요 시 GitHub OAuth 업그레이드.

### 구독/라이선스 관리 흐름

```
Lemon Squeezy 대시보드    → 주문/결제/환불 직접 관리 (항상 사용)
우리 /admin 페이지         → 라이선스 조회/취소, 위젯 통계, 웹훅 로그 (Phase 2)
tRPC router/license.ts    → license.verify (위젯), license.list (관리자)
service/license.ts        → 키 검증, 활성화/비활성화 비즈니스 로직
service/lemonsqueezy.ts   → 웹훅 처리, 체크아웃 URL 생성
```

---

## 9. Lemon Squeezy 결제 플로우

```
사용자 → "Remove Watermark" 클릭
  → Lemon Squeezy 결제 페이지 (이메일만 입력)
    → 결제 완료
      → Lemon Squeezy → Webhook → 우리 서버 (DB에 라이선스 저장)
      → Lemon Squeezy → 이메일로 라이선스 키 발송
        → 사용자가 위젯 URL에 ?license=XXXXX 추가
          → 위젯이 서버에 검증 → 워터마크 제거
```

**"No Sign-up" 유지**: 사용자는 우리 서비스에 가입하지 않음. Lemon Squeezy에서 이메일만 입력.

---

## 10. 배포 전략

### Phase 0: Vercel 통합 배포

```
apps/web → Vercel (widgets.example.com + www.example.com)
```

- `output: "export"` 제거 → Vercel에서 SSR 지원
- embed 경로: `widgets.example.com/embed/clock?color=ff6b6b`
- 랜딩 경로: `www.example.com/`

### Phase 1+: 동일 (API Route 활성화)

Vercel Serverless Functions로 API 자동 배포.

### CI/CD

```yaml
# PR → lint + typecheck + build
# main push → Vercel 자동 배포
```

---

## 11. 비용 분석

| 서비스 | Phase 0 | Phase 1 | Phase 2 |
|--------|---------|---------|---------|
| Vercel (Hobby) | $0 | $0 | $0~20 |
| Turso (Starter) | - | $0 | $0~29 |
| Lemon Squeezy | - | 5%+50c/건 | 5%+50c/건 |
| OpenWeatherMap | - | - | $0 |
| 도메인 | $10~15/년 | $10~15/년 | $10~15/년 |
| **합계** | **~$15/년** | **~$15/년** | **$10~64/년** |

---

## 12. 환경변수

```bash
# --- Turso DB (Phase 1) ---
TURSO_DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="eyJ..."

# --- Lemon Squeezy (Phase 1) ---
LEMONSQUEEZY_API_KEY="eyJ..."
LEMONSQUEEZY_WEBHOOK_SECRET="whsec_..."
LEMONSQUEEZY_STORE_ID="12345"
LS_VARIANT_MONTHLY="111111"
LS_VARIANT_YEARLY="222222"
LS_VARIANT_LIFETIME="333333"

# --- 날씨 API (Phase 2) ---
OPENWEATHER_API_KEY="abc123..."

# --- 관리자 (Phase 2) ---
ADMIN_API_KEY="your-secure-key"

# --- 공개 ---
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_SITE_URL="https://example.com"
```

---

## 13. 개발 스프린트 계획

### Sprint 0 (1주): 모노레포 마이그레이션
- Turborepo + pnpm 초기화
- 기존 위젯 코드 → apps/web/embed/ + packages/widgets/ 이동
- packages/widget-core, packages/ui 추출
- Vercel 배포 설정
- **DoD**: pnpm dev, pnpm build 모두 성공, 기존 위젯 동작 확인

### Sprint 1 (1주): 쿼리 파라미터 시스템
- packages/widget-schemas: Zod 스키마 정의
- use-widget-params 훅 구현
- 플립시계 + 라이프 프로그레스 파라미터 적용
- 워터마크 컴포넌트
- **DoD**: URL 파라미터로 위젯 커스터마이징 동작

### Sprint 2 (1주): 랜딩 페이지 MVP
- 위젯 갤러리 + 커스터마이저 페이지
- URL 생성기 + Copy 버튼
- SEO 기본 설정
- **DoD**: 비개발자가 혼자 위젯 만들어 Notion에 넣을 수 있음

### Sprint 3 (1주): 신규 위젯
- D-Day 카운트다운 위젯
- 명언 위젯 (한/영)
- 테마 시스템 3종
- **DoD**: 위젯 4종, 테마 3종 완성

### Sprint 4-5 (2주): 결제 연동 (Phase 1)
- packages/db: Drizzle + Turso 스키마
- Lemon Squeezy 웹훅 + 라이선스 검증 API
- 프라이싱 페이지
- **DoD**: 결제 → 키 발급 → 워터마크 제거 E2E 동작

---

*Last Updated: 2026-02-23*
