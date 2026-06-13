import { test } from "@playwright/test";
import * as path from "path";

const dir = path.join(__dirname, "../e2e-screenshots");

const pages = [
  { name: "home--ko", url: "/ko" },
  { name: "home--en", url: "/en" },
  { name: "widgets--ko", url: "/ko/widgets" },
  { name: "widgets--en", url: "/en/widgets" },
];

const widgets = [
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
];

/**
 * Slowly scroll the entire page top-to-bottom in small steps,
 * pausing at each step so iframes and lazy content have time to load.
 * Then scroll back to top and wait for final settle.
 */
async function scrollFullPage(page: import("@playwright/test").Page) {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = 900;
  const step = viewportHeight / 2; // half-viewport per step
  let scrolled = 0;

  while (scrolled < totalHeight) {
    scrolled += step;
    await page.evaluate((y) => window.scrollTo(0, y), scrolled);
    await page.waitForTimeout(600);
  }

  // Stay at bottom a bit for last iframes
  await page.waitForTimeout(1500);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}

for (const p of pages) {
  test(p.name, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    await scrollFullPage(page);

    await page.screenshot({
      path: path.join(dir, `${p.name}.png`),
      fullPage: true,
    });
  });
}

for (const w of widgets) {
  test(`customizer--${w}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/ko/widget/${w}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    await scrollFullPage(page);

    await page.screenshot({
      path: path.join(dir, `customizer--${w}.png`),
      fullPage: true,
    });
  });
}
