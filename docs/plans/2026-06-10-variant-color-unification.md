# Variant & Color System Unification

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove all custom color controls (`color`/`bg` params) and hardcoded hex values from widgets. Unify variant naming. Make colorTheme the single source of truth for all colors, resolved inside each widget via `getColorTheme()`.

**Architecture:** Color flows from `colorTheme` param → `getColorTheme(id)` → `{ accent, bg, text, border }`. Widgets consume these 4 tokens exclusively. No more `color`/`bg` URL params. The `style` param continues to control visual design (font, radius, shadow). Variant names are standardized across all widgets.

**Tech Stack:** TypeScript, Zod, React, widget-core registry system

---

## Design Decisions

### Unified Variant System
Variants are **widget-specific** — each widget keeps the variants that make sense for it. But naming conventions are standardized:
- `"minimal"` = clean, reduced (default for most)
- `"detailed"` = more info shown
- `"card"` = contained card layout
- `"compact"` = space-efficient

Removed/renamed:
- Flip Clock `"neon"` variant → remove (neon is a `style`, not a variant)
- Flip Clock `"flip"` → keep (it's a unique mechanism)
- Analog Clock `"vintage"` → remove (style concern, not layout)
- Focus Word `"gradient"` / `"bold"` → remove (color/style concerns, not layout)

### Color Resolution
Every widget resolves colors at render time:
```ts
const ct = getColorTheme(params.colorTheme);
const { accent, bg, text, border } = ct?.colors ?? DEFAULT_COLORS;
```
Opacity variants are derived with hex alpha: `accent + "20"` (not hardcoded colors).

### What Gets Removed
1. `color` and `bg` from every schema.ts
2. `color` and `bg` controls from every index.ts
3. `"color"` group from ControlDefinition groups
4. ColorControl component (becomes unused)
5. Custom color handling in customizer-page.tsx
6. All hardcoded hex values in widget.tsx files (#fafafa, #ff4444, #60a5fa, etc.)
7. `hexToRgba` in widget-shell.tsx (bg comes from colorTheme now)

---

## Task 1: Update widget-core — ColorTheme becomes the authority

**Files:**
- Modify: `packages/widget-core/src/color-theme.ts`
- Modify: `packages/widget-core/src/theme.ts`
- Modify: `packages/widget-core/src/types.ts`
- Modify: `packages/widget-core/src/presets.ts`
- Modify: `packages/widget-core/src/index.ts`

**Step 1: Add `resolveColors` helper to color-theme.ts**

Add a convenience function that widgets call to get colors:
```ts
const DEFAULT_COLORS = { accent: "7fb686", bg: "18181b", text: "fafafa", border: "27272a" };

export function resolveColors(colorThemeId?: string) {
  const ct = getColorTheme(colorThemeId || "default");
  return ct?.colors ?? DEFAULT_COLORS;
}
```

**Step 2: Remove `recommendedColors` from StyleDesign in theme.ts**

Delete the `recommendedColors` property from the `StyleDesign` interface and all 4 style definitions. Style should only control layout/effects, not colors.

**Step 3: Remove `"color"` from control group type in types.ts**

Change group type:
```ts
group?: "appearance" | "content" | "advanced";
```

**Step 4: Remove color-related deprecated exports from presets.ts**

No changes needed to presets — `colorThemeControl` stays, `styleControl` stays. But remove `themeControl` deprecated alias if desired.

**Step 5: Export `resolveColors` from index.ts**

Add to the barrel export:
```ts
export { getColorTheme, getAllColorThemes, COLOR_THEME_OPTIONS, resolveColors } from "./color-theme";
```

**Step 6: Commit**
```
refactor(widget-core): add resolveColors, remove recommendedColors and color group
```

---

## Task 2: Strip `color`/`bg` from all 16 widget schemas

**Files:** All `packages/widgets/src/*/schema.ts` (16 files)

For each schema.ts, remove:
- The `hexColor` const (if only used by `color`)
- `color: hexColor` field
- `bg: z.string().default(...)` field

Keep `colorTheme: z.string().default("default")` in all schemas.

Also update types — the exported type will no longer have `color` or `bg` properties.

**Widgets and their schema changes:**

| Widget | Remove fields | Keep fields |
|--------|---------------|-------------|
| analog-clock | color, bg | style, colorTheme, variant, showNumbers, showSeconds |
| breathing | color, bg | style, colorTheme, technique, variant |
| countdown | color, bg | style, colorTheme, targetDate, label, variant, showHours |
| daily-tarot | color, bg | style, colorTheme, deck, variant, locale |
| daily-tip | color, bg | style, colorTheme, category, locale, fontSize, mode |
| flip-clock | color, bg | colorTheme, variant, format, locale, showSeconds, showLabel |
| focus-word | color, bg | style, colorTheme, word, variant |
| habit-heatmap | color, bg | style, colorTheme, weeks, label |
| life-progress | color, bg | style, colorTheme, variant, target, start, label, title, locale, dateFormat, show* |
| mini-calendar | color, bg | style, colorTheme, locale, firstDay, variant |
| moon-phase | color, bg | style, colorTheme, variant, locale |
| pomodoro | color, bg | style, colorTheme, variant, workMinutes, breakMinutes, sessions |
| quote | color, bg | style, colorTheme, locale, fontSize, mode |
| startup-tips | color, bg | style, colorTheme, category, locale, mode, fontSize |
| weather | color, bg | style, colorTheme, variant, city, units |
| world-clock | color, bg | style, colorTheme, timezones, format, variant |

**Step 1: Update all 16 schema.ts files** — remove `color`, `bg`, and unused `hexColor`

**Step 2: Commit**
```
refactor(widgets): remove color/bg params from all widget schemas
```

---

## Task 3: Strip color controls from all 16 widget registrations

**Files:** All `packages/widgets/src/*/index.ts` (16 files)

For each index.ts, remove:
- The control with `key: "color"` (Accent Color)
- The control with `key: "bg"` (Background Color)

Also clean up variant options per the unification plan:

| Widget | Variant changes |
|--------|----------------|
| analog-clock | Remove `"vintage"` → keep `["minimal", "classic"]` |
| flip-clock | Remove `"neon"` → keep `["minimal", "flip"]`. Add `style` param + `styleControl` |
| focus-word | Remove `"gradient"`, `"bold"` → keep `["minimal"]` (only 1 variant = remove variant control entirely) |
| All others | No variant changes |

**Step 1: Update all 16 index.ts files**

**Step 2: Commit**
```
refactor(widgets): remove color/bg controls, unify variant options
```

---

## Task 4: Update widget-shell.tsx — resolve bg from colorTheme

**Files:**
- Modify: `packages/widgets/src/widget-shell.tsx`

The shell currently reads `params.bg` for background. Change it to read `params.colorTheme` and resolve via `resolveColors()`.

```tsx
import { getStyleDesign, resolveColors } from "@nw/widget-core";

interface WidgetShellProps {
  params: { style?: string; colorTheme?: string };
  children: ReactNode;
  className?: string;
}

export function WidgetShell({ params, children, className }: WidgetShellProps) {
  const design = getStyleDesign(params.style || "minimal");
  const colors = resolveColors(params.colorTheme);
  const bgHex = colors.bg;

  // ... rest uses bgHex same as before, but from colorTheme
}
```

Remove `hexToRgba` if no longer needed (or keep if glass style still needs it).

**Step 1: Update widget-shell.tsx**

**Step 2: Commit**
```
refactor(widget-shell): resolve background from colorTheme instead of params.bg
```

---

## Task 5: Update all 16 widget.tsx — resolve colors from colorTheme, remove hardcoded hex

**Files:** All `packages/widgets/src/*/widget.tsx` (16 files)

This is the largest task. For each widget.tsx:

1. Import `resolveColors` from `@nw/widget-core`
2. Replace `const accent = "#" + params.color` with `const { accent, bg, text, border } = resolveColors(params.colorTheme)` (values already include no `#`, so prefix where needed)
3. Replace all hardcoded hex colors with theme tokens:
   - `#fafafa` → `text` token
   - `#18181b` / `#0a0a0a` → `bg` token
   - `#27272a` → `border` token
   - `#ff4444`, `#60a5fa`, `#8b7355` etc. → derive from `accent` with opacity
4. For opacity variants, use `accent + "20"` pattern (already used in some widgets)

**Key per-widget changes:**

| Widget | Hardcoded to remove | Notes |
|--------|-------------------|-------|
| analog-clock | `#fafafa`, `#8b7355`, `#4a3728`, `#8b4513` | Vintage colors removed (variant removed) |
| breathing | Clean — only uses accent + opacity | Minimal changes |
| countdown | `#ff4444`, `#fafafa` | Urgent color → `accent` |
| daily-tarot | Mostly clean | Just swap params.color |
| daily-tip | Clean | Just swap params.color |
| flip-clock | `#fafafa` | text color → `text` token |
| focus-word | Clean — opacity patterns | Remove gradient/bold variant rendering |
| habit-heatmap | `rgba(255,255,255,0.05)` | → `text + "0d"` |
| life-progress | `#fafafa`, `#555`, `#333`, `#27272a` | Heavy cleanup |
| mini-calendar | `#18181b` | → `bg` token |
| moon-phase | Clean | Just swap params.color |
| pomodoro | `#60a5fa` (break color) | → derive from accent with different opacity |
| quote | `#fafafa` | → `text` token |
| startup-tips | Clean | Just swap params.color |
| weather | Clean | Just swap params.color |
| world-clock | Clean | Just swap params.color |

**Step 1: Update all 16 widget.tsx files**

Each widget should follow this pattern at the top:
```tsx
const colors = resolveColors(params.colorTheme);
const accent = `#${colors.accent}`;
const textColor = `#${colors.text}`;
const borderColor = `#${colors.border}`;
```

**Step 2: Commit**
```
refactor(widgets): resolve all colors from colorTheme, remove hardcoded hex values
```

---

## Task 6: Update customizer — remove color picker logic

**Files:**
- Modify: `apps/web/src/app/[locale]/widget/[widgetId]/customizer-page.tsx`
- Delete: `apps/web/src/components/customizer/controls/color-control.tsx`
- Modify: `apps/web/src/components/customizer/control-panel.tsx`

**Step 1: Simplify customizer-page.tsx handleChange**

Remove the special `colorTheme` → `color`/`bg` sync logic:
```tsx
const handleChange = useCallback((key: string, value: string) => {
  setCurrentParams((prev) => ({ ...prev, [key]: value }));
}, []);
```

**Step 2: Remove ColorControl from control-panel.tsx**

Remove the import and `case "color":` from the switch.

**Step 3: Delete color-control.tsx**

**Step 4: Update i18n dictionaries** — remove `controlGroups.color` label if it exists

**Step 5: Commit**
```
refactor(customizer): remove color picker controls and sync logic
```

---

## Task 7: Update flip-clock — add missing `style` param

**Files:**
- Modify: `packages/widgets/src/flip-clock/schema.ts`
- Modify: `packages/widgets/src/flip-clock/index.ts`

Flip-clock is the only widget without `style` in its schema. Add it for consistency.

**Step 1: Add `style: z.string().default("minimal")` to flipClockSchema**

**Step 2: Add `styleControl` to flip-clock controls array**

**Step 3: Commit**
```
fix(flip-clock): add missing style param for consistency
```

---

## Task 8: Build verification

**Step 1: Run `pnpm build`**

Expected: 0 errors, 0 warnings. All 28+ static pages generated.

**Step 2: Fix any TypeScript errors from removed `color`/`bg` references**

Likely places:
- Widget components accessing `params.color` or `params.bg`
- Type mismatches after schema changes

**Step 3: Commit fixes if any**
```
fix: resolve build errors from color system refactor
```

---

## Execution Order

Tasks 1 → 2 → 3 can be parallelized (core, schemas, registrations are independent changes to different files).
Task 4 depends on Task 1 (needs `resolveColors`).
Task 5 depends on Tasks 1 + 2 (needs `resolveColors` + updated types).
Task 6 is independent of widget changes.
Task 7 is a small fix, can go anytime.
Task 8 must be last.

Recommended serial order: **1 → 2+3 (parallel) → 4+7 (parallel) → 5 → 6 → 8**
