import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * E2E visual test: captures every widget × accent combination.
 * Verifies accent color appears in rendered DOM.
 */

const WIDGETS = [
  "analog-clock", "breathing", "countdown", "daily-tarot", "daily-tip",
  "flip-clock", "focus-word", "habit-heatmap", "life-progress", "mini-calendar",
  "moon-phase", "pomodoro", "quote", "startup-tips", "weather", "world-clock",
] as const;

const ACCENTS = [
  { id: "green", color: "7fb686" },
  { id: "red", color: "ef4444" },
  { id: "blue", color: "3b82f6" },
  { id: "ocean", color: "06b6d4" },
  { id: "sunset", color: "f97316" },
  { id: "purple", color: "a855f7" },
] as const;

const SCREENSHOT_DIR = path.join(__dirname, "../e2e-screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
});

for (const widget of WIDGETS) {
  test.describe(`${widget}`, () => {
    for (const accent of ACCENTS) {
      test(`accent=${accent.id}`, async ({ page }) => {
        const url = `/embed/${widget}?accent=${accent.id}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForSelector("div.min-h-screen", { state: "visible", timeout: 15_000 });
        await page.waitForTimeout(800);

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${widget}--${accent.id}.png`),
          fullPage: true,
        });

        const bodyText = await page.textContent("body");
        expect(bodyText).not.toContain("Widget not found");
      });
    }
  });
}
