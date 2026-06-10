import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3333",
    screenshot: "off",
  },
  webServer: {
    command: "cd apps/web && PORT=3333 pnpm dev",
    port: 3333,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", viewport: { width: 500, height: 400 } },
    },
  ],
});
