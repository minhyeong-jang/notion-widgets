# Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement the full redesign from `_redesign/` prototypes into the Next.js codebase — 4 pages, unified ACCENT×MODE theme system, system-theme auto-detection for embeds, E2E verification.

**Architecture:** Replace existing warm-zinc design with editorial warm-neutral tokens. Unify color system to 2-axis (ACCENT 6colors × MODE dark/light). Site pages use ThemeSwitcher for manual control; embedded widgets auto-detect via `prefers-color-scheme`. All pages (Home, Gallery, Detail, Feedback) rebuilt to match `_redesign/` prototypes.

**Tech Stack:** Next.js 16, Tailwind CSS 4, TypeScript, Playwright E2E

---

## Task 1: Design Tokens + Fonts

**Goal:** Replace globals.css with redesign tokens, add Pretendard + JetBrains Mono fonts.

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Modify: `apps/web/src/app/layout.tsx`

**What to do:**

1. Replace `:root` in `globals.css` with redesign tokens from `_redesign/assets/site.css`:
   - Warm neutral darks: `--bg`, `--bg-soft`, `--surface`, `--surface-2`, `--inset`, `--border`, `--border-soft`, `--border-strong`, `--track`, `--text`, `--text-dim`, `--text-faint`, `--heat-empty`, `--shadow`
   - Accent (default green): `--accent`, `--accent-bright`, `--accent-deep`, `--accent-dim`, `--accent-tint`, `--btn-text`
   - Typography: `--font-sans`, `--font-mono`, `--maxw`
   - Rename `--green*` → `--accent*` in all token declarations

2. Add `@media (prefers-color-scheme: light)` block with light-mode overrides from `_redesign/assets/theme.js` MODES.light

3. Register tokens in Tailwind `@theme inline` block so utilities like `bg-surface`, `text-dim`, `border-border` work

4. Update `[locale]/layout.tsx`: replace Geist fonts with Pretendard (CDN) + JetBrains Mono (Google Fonts). Remove geistSans/geistMono variables, use `--font-sans` / `--font-mono`

5. Keep flip clock animations (keyframes) intact

6. Remove old landing page animations (drift, float, scrollBounce, hero-content) — redesign doesn't use them

**Commit:** `refactor: replace design tokens with warm-neutral editorial system`

---

## Task 2: Unified Theme System (ACCENT × MODE)

**Goal:** Replace `color-theme.ts` with 2-axis system. Rename widget param `colorTheme` → `accent`.

**Files:**
- Modify: `packages/widget-core/src/color-theme.ts` — replace with ACCENTS × MODES structure
- Modify: `packages/widget-core/src/presets.ts` — update `colorThemeControl` → `accentControl`
- Modify: `packages/widget-core/src/index.ts` — update exports
- Modify: `packages/widget-core/src/types.ts` — if needed
- Modify: ALL 16 `packages/widgets/src/*/schema.ts` — `colorTheme` → `accent`
- Modify: ALL 16 `packages/widgets/src/*/index.ts` — control key rename
- Modify: ALL 16 `packages/widgets/src/*/widget.tsx` — `resolveColors(params.colorTheme)` → `resolveColors(params.accent)`
- Modify: `packages/widgets/src/widget-shell.tsx` — same rename
- Modify: `apps/web/src/app/[locale]/widget/[widgetId]/customizer-page.tsx` — remove old colorTheme sync

**New `color-theme.ts` structure:**
```ts
interface AccentColors {
  accent: string;
  accentBright: string;
  accentDeep: string;
  accentDim: string;
  accentTint: string;
  btnText: string;
}

interface ModeColors {
  bg: string;
  bgSoft: string;
  surface: string;
  surface2: string;
  inset: string;
  border: string;
  borderSoft: string;
  borderStrong: string;
  track: string;
  text: string;
  textDim: string;
  textFaint: string;
}

const MODES: Record<"dark"|"light", ModeColors> = { ... };
const ACCENTS: Record<string, { dark: AccentColors; light: AccentColors }> = { ... };

// 6 accents: green, red, blue, ocean, sunset, purple
// Values from _redesign/assets/theme.js

export function resolveColors(accent?: string, mode?: "dark"|"light") {
  const m = MODES[mode || "dark"];
  const a = (ACCENTS[accent || "green"] || ACCENTS.green)[mode || "dark"];
  return { ...m, ...a };
}
```

**Widget param rename:** All 16 schemas change `colorTheme: z.string().default("default")` → `accent: z.string().default("green")`. All widget.tsx change `resolveColors(params.colorTheme)` → `resolveColors(params.accent)`.

**Backward compat:** In `parseWidgetParams` or embed page, if URL has `colorTheme=X`, map it to `accent=X` (and `default` → `green`, `forest` → `green`).

**Commit:** `refactor: unified ACCENT×MODE theme system, rename colorTheme→accent`

---

## Task 3: Embed Layout — System Theme Auto-Detection

**Goal:** Embedded widgets auto-detect visitor's OS dark/light preference via CSS.

**Files:**
- Modify: `apps/web/src/app/embed/layout.tsx`
- Modify: `packages/widgets/src/widget-shell.tsx`

**What to do:**

1. In `embed/layout.tsx`, inject a `<style>` block or class that sets CSS variables based on `prefers-color-scheme`:
   ```tsx
   <style dangerouslySetInnerHTML={{ __html: `
     :root { /* dark mode tokens (default) */ }
     @media (prefers-color-scheme: light) {
       :root { /* light mode tokens */ }
     }
   `}} />
   ```

2. Update `widget-shell.tsx`: instead of resolving bg from `resolveColors()` JS-side, use CSS variables for background. The shell sets `background-color: var(--bg)` and the CSS media query handles the mode switch.

3. Widget components still call `resolveColors(params.accent)` for accent colors (accent doesn't change with mode in embed — it's set by URL param). But for neutral colors (text, bg, border), they should use CSS variables.

**Alternative simpler approach:** Pass `mode` from a hook that reads `matchMedia('(prefers-color-scheme: dark)')` and call `resolveColors(params.accent, mode)` in each widget. This is simpler and works with the existing inline-style approach.

→ Use the simpler JS approach: add `useColorMode()` hook that returns `"dark"|"light"`, used by WidgetShell and widgets.

**Commit:** `feat: embed widgets auto-detect system dark/light mode`

---

## Task 4: Shared Components — Header, Footer, ThemeSwitcher, Card, Button

**Goal:** Build the redesigned shared UI components matching `_redesign/assets/site.css`.

**Files:**
- Modify: `apps/web/src/components/shared/header.tsx`
- Create: `apps/web/src/components/shared/footer.tsx` (new, extracted from landing)
- Create: `apps/web/src/components/shared/theme-switcher.tsx` (new)
- Modify: `apps/web/src/components/shared/widget-card.tsx`
- Create: `apps/web/src/components/shared/button.tsx` (new)

**Header:** Sticky, blur bg (`color-mix`), logo SVG with accent squares, nav-pill (홈/위젯/제보), lang switcher (KO/EN). Match `_redesign/assets/site.css` header styles exactly.

**Footer:** Simple — logo left, links right (widgets.doriri.dev, made by doriri). Border-top separator.

**ThemeSwitcher:** Fixed bottom-right pill. Mode toggle (sun/moon SVG) + separator + 6 accent dots + current name. Uses `localStorage["nw-mode-v1"]` and `localStorage["nw-accent-v1"]`. Calls CSS variable updates on `documentElement.style`.

**Card:** `.canvas` preview area + `h3` + `p` + `.card-foot` (monospace id + "커스터마이즈 →"). Hover: border-strong + translateY(-2px). Match prototype exactly.

**Button:** `.btn-primary` (accent fill) + `.btn-ghost` (transparent + border). Arrow animation on hover.

**Commit:** `feat: redesigned shared components (header, footer, theme-switcher, card, button)`

---

## Task 5: Home Page Redesign

**Goal:** Rebuild landing page to match `_redesign/Home.html`.

**Files:**
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Rewrite: `apps/web/src/components/landing/hero.tsx`
- Rewrite: `apps/web/src/components/landing/widget-gallery.tsx` → Featured section
- Rewrite: `apps/web/src/components/landing/how-it-works.tsx`
- Delete: `apps/web/src/components/landing/footer.tsx` (moved to shared)
- Modify: i18n dictionaries for updated copy

**Sections:**
1. **Hero** — 2-col grid (text left / Notion embed mockup right). h1 50px/800, accent word, 2 CTAs
2. **Featured** — sec-kicker "FEATURED", h2 "자주 쓰는 위젯", 6 cards in 3-col grid, gallery CTA bar
3. **How it works** — 3-step cards with monospace step numbers, code badge for `/embed`
4. **Footer** — shared component

**Commit:** `feat: redesigned home page with editorial layout`

---

## Task 6: Gallery Page Redesign

**Goal:** Rebuild gallery to match `_redesign/gallery.html`.

**Files:**
- Modify: `apps/web/src/app/[locale]/widgets/page.tsx`
- Rewrite: `apps/web/src/components/gallery/widget-gallery-page.tsx`

**Layout:**
- Sec-kicker "GALLERY · 16 WIDGETS"
- h2 "모든 위젯" + description
- Filter bar: category chips (전체/시간/생산성/라이프스타일/유틸리티) + search input
- 4-col card grid (responsive → 2 → 1)
- Client-side filtering (no server request)
- Cards use shared Card component with iframe preview

**Commit:** `feat: redesigned gallery with chip filters and search`

---

## Task 7: Detail/Customizer Page Redesign

**Goal:** Rebuild customizer to match `_redesign/detail.html`.

**Files:**
- Modify: `apps/web/src/app/[locale]/widget/[widgetId]/customizer-page.tsx`
- Modify: `apps/web/src/components/customizer/control-panel.tsx`
- Modify: `apps/web/src/components/customizer/preview-frame.tsx`
- Modify: `apps/web/src/components/customizer/url-generator.tsx`
- Modify: customizer controls as needed

**Layout:**
- Breadcrumb: 위젯 갤러리 > 시간
- Widget name + description + meta chips (id, category, size)
- 2-col: left = preview stage (LIVE PREVIEW label + realtime indicator), right = controls
- Controls: accent swatches, segment toggles (24시간/12시간), toggle switches
- Bottom: embed URL + copy button + Notion instruction
- "같은 카테고리의 다른 위젯" section with 3-4 related cards

**Commit:** `feat: redesigned customizer with editorial controls layout`

---

## Task 8: Feedback Page (New)

**Goal:** Create feedback page matching `_redesign/feedback.html`.

**Files:**
- Create: `apps/web/src/app/[locale]/feedback/page.tsx`
- Create: `apps/web/src/components/feedback/feedback-form.tsx`
- Modify: i18n dictionaries

**Layout:**
- 2-col: left = description/explanation, right = form
- Form fields: widget selector, type (bug/feature/other), title, content, contact (optional)
- Submit → console.log for now (Notion API later)
- Success state after submission

**Commit:** `feat: add feedback page with form`

---

## Task 9: i18n Updates

**Goal:** Update ko/en dictionaries with all new copy from redesign.

**Files:**
- Modify: `apps/web/src/i18n/dictionaries/ko.ts`
- Modify: `apps/web/src/i18n/dictionaries/en.ts`

**Add keys for:**
- Feedback page labels
- Updated hero copy
- Gallery filter labels, search placeholder
- Detail page breadcrumb, live preview label, embed instruction
- ThemeSwitcher labels
- Footer updated text

**Commit:** `feat: update i18n dictionaries for redesigned pages`

---

## Task 10: SEO + Sitemap + Marketing

**Goal:** Update SEO for new pages, ensure marketing conversion path is solid.

**Files:**
- Modify: `apps/web/src/app/sitemap.ts`
- Modify: `apps/web/src/app/robots.ts`
- Add metadata to feedback page

**What to do:**
- Add `/[locale]/feedback` to sitemap with hreflang
- Ensure JSON-LD on gallery and detail pages
- Verify OG tags on all pages
- Check CTA flow: Home → Gallery → Detail → URL Copy

**Commit:** `feat: add feedback to sitemap, verify SEO across redesigned pages`

---

## Task 11: Build + E2E Verification

**Goal:** Verify everything works: build passes, all pages render, colors correct.

**Files:**
- Modify: `e2e/widget-color-themes.spec.ts` — update `colorTheme` → `accent` in URLs
- Modify: `e2e/pages.spec.ts` — add feedback page, verify redesigned layouts
- Create: `e2e/theme-switcher.spec.ts` — test mode/accent switching on site pages
- Create: `e2e/embed-system-theme.spec.ts` — test prefers-color-scheme in embeds

**Steps:**
1. `pnpm build` — 0 errors
2. Run all E2E tests
3. Capture screenshots of all pages (dark + light)
4. Capture all widgets × accents (dark + light)
5. Visual review of captures

**Commit:** `test: update E2E tests for redesign, verify all pages and themes`

---

## Execution Order

```
Task 1 (tokens)
  → Task 2 (theme system)
    → Task 3 (embed auto-detect)
    → Task 4 (shared components) 
      → Task 5 (home)
      → Task 6 (gallery)
      → Task 7 (detail)
      → Task 8 (feedback)
      → Task 9 (i18n)
  → Task 10 (SEO)
→ Task 11 (build + E2E)
```

Tasks 5-9 can be parallelized after Task 4.
Task 11 must be last.
