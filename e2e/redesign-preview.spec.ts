import { test } from "@playwright/test";
import * as path from "path";

const dir = path.join(__dirname, "../e2e-screenshots");
const base = `file://${path.join(__dirname, "../_redesign")}`;

const htmlPages = [
  { name: "redesign--home-dark", url: "Home.html" },
  { name: "redesign--gallery-dark", url: "gallery.html" },
  { name: "redesign--detail-dark", url: "detail.html?w=flip-clock" },
  { name: "redesign--detail-tarot-dark", url: "detail.html?w=daily-tarot" },
  { name: "redesign--feedback-dark", url: "feedback.html" },
];

async function scrollFullPage(page: import("@playwright/test").Page) {
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const step = 450;
  let scrolled = 0;
  while (scrolled < totalHeight) {
    scrolled += step;
    await page.evaluate((y) => window.scrollTo(0, y), scrolled);
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
}

for (const p of htmlPages) {
  test(p.name, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/${p.url}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await scrollFullPage(page);
    await page.screenshot({
      path: path.join(dir, `${p.name}.png`),
      fullPage: true,
    });
  });
}

// Light mode versions
const lightPages = [
  { name: "redesign--home-light", url: "Home.html" },
  { name: "redesign--gallery-light", url: "gallery.html" },
  { name: "redesign--detail-light", url: "detail.html?w=flip-clock" },
];

for (const p of lightPages) {
  test(p.name, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/${p.url}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    // Switch to light mode
    await page.evaluate(() => (window as any).NW_setMode("light"));
    await page.waitForTimeout(500);
    await scrollFullPage(page);
    await page.screenshot({
      path: path.join(dir, `${p.name}.png`),
      fullPage: true,
    });
  });
}
