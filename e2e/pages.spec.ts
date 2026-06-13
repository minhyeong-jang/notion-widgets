import { test } from "@playwright/test";
import * as path from "path";

const dir = path.join(__dirname, "../e2e-screenshots");

const pages = [
  { name: "home--ko", url: "/ko" },
  { name: "home--en", url: "/en" },
  { name: "widgets--ko", url: "/ko/widgets" },
  { name: "widgets--en", url: "/en/widgets" },
  { name: "feedback--ko", url: "/ko/feedback" },
  { name: "feedback--en", url: "/en/feedback" },
];

const widgets = [
  "analog-clock", "breathing", "countdown", "daily-tarot", "daily-tip",
  "flip-clock", "focus-word", "habit-heatmap", "life-progress", "mini-calendar",
  "moon-phase", "pomodoro", "quote", "startup-tips", "weather", "world-clock",
];

async function scrollFullPage(page: import("@playwright/test").Page) {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 450;
  let scrolled = 0;
  while (scrolled < totalHeight) {
    scrolled += step;
    await page.evaluate((y) => window.scrollTo(0, y), scrolled);
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
}

for (const p of pages) {
  test(p.name, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(p.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await scrollFullPage(page);
    await page.screenshot({ path: path.join(dir, `${p.name}.png`), fullPage: true });
  });
}

for (const w of widgets) {
  test(`customizer--${w}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/ko/widget/${w}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await scrollFullPage(page);
    await page.screenshot({ path: path.join(dir, `customizer--${w}.png`), fullPage: true });
  });
}
