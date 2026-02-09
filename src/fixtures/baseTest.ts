import { test as base, BrowserContext, Locator, Page } from "@playwright/test";

// Create isolated page per test
export const test = base.extend<{
  page: Page;
}>({
  page: async ({ browser }, use) => {
    // Create new context for this test
    const context: BrowserContext = await browser.newContext({
      viewport: null, // optional: full window
    });
    const page: Page = await context.newPage();

    // Go to agents page
    await page.goto("/agents");

    // Handle cookie popup if present
    const acceptBtn: Locator = page.getByRole("button", { name: /accept/i });
    if (await acceptBtn.isVisible().catch(() => false)) {
      await acceptBtn.click();
    }

    // Use the page in the test
    await use(page);

    // Close context after test
    await context.close();
  },
});

export { expect } from "@playwright/test";
