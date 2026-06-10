import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * E2E visual test: captures every widget × colorTheme combination.
 *
 * For each widget, loads /embed/{widgetId}?colorTheme={theme}
 * and takes a screenshot. Then verifies the accent color from
 * the color theme actually appears in the rendered page.
 */

const WIDGETS = [
  "analog-clock",
  "breathing",
  "countdown",
  "daily-tarot",
  "daily-tip",
  "flip-clock",
  "focus-word",
  "habit-heatmap",
  "life-progress",
  "mini-calendar",
  "moon-phase",
  "pomodoro",
  "quote",
  "startup-tips",
  "weather",
  "world-clock",
] as const;

const COLOR_THEMES = [
  { id: "default", accent: "7fb686", bg: "18181b" },
  { id: "red", accent: "ef4444", bg: "18181b" },
  { id: "blue", accent: "3b82f6", bg: "18181b" },
  { id: "ocean", accent: "06b6d4", bg: "0c1222" },
  { id: "sunset", accent: "f97316", bg: "1c1210" },
  { id: "purple", accent: "a855f7", bg: "13091f" },
  { id: "light", accent: "7fb686", bg: "fafaf9" },
] as const;

const SCREENSHOT_DIR = path.join(__dirname, "../e2e-screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

for (const widget of WIDGETS) {
  test.describe(`${widget}`, () => {
    for (const theme of COLOR_THEMES) {
      test(`colorTheme=${theme.id}`, async ({ page }) => {
        const url = `/embed/${widget}?colorTheme=${theme.id}`;
        await page.goto(url, { waitUntil: "networkidle" });

        // Wait for CSR hydration — look for the WidgetShell container
        await page.waitForSelector("div.min-h-screen", {
          state: "visible",
          timeout: 15_000,
        });
        await page.waitForTimeout(800);

        // Take screenshot
        const screenshotPath = path.join(
          SCREENSHOT_DIR,
          `${widget}--${theme.id}.png`,
        );
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Verify not an error page
        const bodyText = await page.textContent("body");
        expect(bodyText).not.toContain("Widget not found");

        // Verify background color
        const bgColor = await page.evaluate(() => {
          const root = document.querySelector(
            "div.min-h-screen",
          ) as HTMLElement | null;
          if (!root) return null;
          return window.getComputedStyle(root).backgroundColor;
        });

        if (bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
          const expectedBg = hexToRgb(theme.bg);
          const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (match) {
            const [, r, g, b] = match.map(Number);
            expect(
              Math.abs(r - expectedBg.r) < 30 &&
                Math.abs(g - expectedBg.g) < 30 &&
                Math.abs(b - expectedBg.b) < 30,
              `BG mismatch in ${widget}/${theme.id}: got ${bgColor}, expected ~#${theme.bg}`,
            ).toBe(true);
          }
        }

        // Verify accent color appears somewhere in the DOM
        const accentFound = await page.evaluate((accentHex: string) => {
          function h2r(hex: string) {
            return {
              r: parseInt(hex.slice(0, 2), 16),
              g: parseInt(hex.slice(2, 4), 16),
              b: parseInt(hex.slice(4, 6), 16),
            };
          }
          function match(css: string, t: { r: number; g: number; b: number }) {
            const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (!m) return false;
            const [, r, g, b] = m.map(Number);
            return (
              Math.abs(r - t.r) < 15 &&
              Math.abs(g - t.g) < 15 &&
              Math.abs(b - t.b) < 15
            );
          }

          const target = h2r(accentHex);

          // Check computed styles
          for (const el of document.querySelectorAll("*")) {
            const s = window.getComputedStyle(el);
            if (
              match(s.color, target) ||
              match(s.backgroundColor, target) ||
              match(s.borderColor, target) ||
              match(s.borderTopColor, target)
            ) {
              return true;
            }
          }

          // Check inline style attributes for hex references
          const hexLower = accentHex.toLowerCase();
          for (const el of document.querySelectorAll("[style]")) {
            if (
              (el.getAttribute("style") || "").toLowerCase().includes(hexLower)
            ) {
              return true;
            }
          }

          // Check SVG fill/stroke attributes
          for (const el of document.querySelectorAll("svg *")) {
            const fill = el.getAttribute("fill") || "";
            const stroke = el.getAttribute("stroke") || "";
            if (
              fill.toLowerCase().includes(hexLower) ||
              stroke.toLowerCase().includes(hexLower)
            ) {
              return true;
            }
          }

          return false;
        }, theme.accent);

        expect(
          accentFound,
          `Accent #${theme.accent} (${theme.id}) NOT found in ${widget}`,
        ).toBe(true);
      });
    }
  });
}
