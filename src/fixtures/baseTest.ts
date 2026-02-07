import { test as base, Locator } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto("/agents");

    // Handle cookie popup if present
    const acceptBtn: Locator = page.getByRole("button", { name: /accept/i });
    if (await acceptBtn.isVisible().catch(() => false)) {
      await acceptBtn.click();
    }

    await use(page);
  },
});

export { expect } from "@playwright/test";
