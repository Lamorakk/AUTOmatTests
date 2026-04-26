import { defineConfig, devices } from "@playwright/test";

/**
 * User-scenario tests — same public demo as lab 5 (one product: task list).
 */
export default defineConfig({
  testDir: "./tests/scenarios",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  timeout: 45_000,
  expect: { timeout: 12_000 },
  use: {
    baseURL: "https://demo.playwright.dev",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    locale: "en-US",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
