import { defineConfig, Project } from "@playwright/test";

const browserEnv = process.env.BROWSER || "chrome";

// Create projects dynamically
const projects: Project[] = [];

if (browserEnv === "chrome") {
  projects.push({ name: "chrome", use: { browserName: "chromium" } });
}
if (browserEnv === "firefox") {
  projects.push({ name: "firefox", use: { browserName: "firefox" } });
}
if (browserEnv === "edge") {
  projects.push({ name: "edge", use: { channel: "msedge" } });
}
if (browserEnv === "safari") {
  projects.push({ name: "safari", use: { browserName: "webkit" } });
}

export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["allure-playwright"]],
  use: {
    baseURL: "https://attri.ai",
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 60_000, // max time for click(), fill(), etc.
    navigationTimeout: 60_000, // max time for page.goto(), navigation
    viewport: null, // disables default viewport
    launchOptions: {
      args: ["--start-maximized"],
    },
  },

  expect: {
    timeout: 10_000, // max time for expect(locator).toBeVisible(), etc.
  },

  // Assign the projects array
  projects: projects,
});
