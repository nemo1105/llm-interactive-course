import { defineConfig, devices } from "@playwright/test";

const host = "127.0.0.1";
const localPort = process.env.PLAYWRIGHT_PORT ?? "5173";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${localPort}`;
const shouldStartLocalServer = !process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  testDir: "./e2e/specs",
  fullyParallel: true,
  reporter: process.env.CI ? "html" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: shouldStartLocalServer
    ? {
        command: `pnpm run dev --host ${host} --port ${localPort} --strictPort`,
        reuseExistingServer: false,
        timeout: 120_000,
        url: baseURL,
      }
    : undefined,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
