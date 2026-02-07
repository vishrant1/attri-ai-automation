import { test, expect } from "../fixtures/baseTest";

test("Header and footer are visible", async ({ page }) => {
  await expect(page.getByRole("link", { name: /pricing/i })).toBeVisible();
  await expect(page.getByText(/trust center/i)).toBeVisible();
});
