import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },

  reporter: [
    ["html", { outputFolder: "test-results/html", open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
    ["list"],
  ],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: "e2e-chromium",
      testDir: "./tests/e2e",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: BASE_URL,
      },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          "Content-Type": "application/json",
        },
      },
    },
    {
      name: "accessibility",
      testDir: "./tests/accessibility",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: BASE_URL,
      },
    },
  ],

  outputDir: "test-results/artifacts",
});
