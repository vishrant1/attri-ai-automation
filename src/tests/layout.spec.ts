import { test, expect } from "../fixtures/baseTest";
import { LayoutPage } from "../pages/LayoutPage";

test.describe("Navigation & Global Layout", () => {
  let layout: LayoutPage;

  test.beforeEach(async ({ page }) => {
    layout = new LayoutPage(page);
  });

  test("Verify header navigation links are visible", async () => {
    //Step 1: Verify header navigation links are visible
    // Expect: All header links are visible
    await expect(layout.agentsGalleryLink).toBeVisible();
    await expect(layout.becomePartnerLink).toBeVisible();
    await expect(layout.pricingLink).toBeVisible();
    await expect(layout.contactUsLink).toBeVisible();
    await expect(layout.loginButton).toBeVisible();
    await expect(layout.startForFreeButton).toBeVisible();
  });

  test("Verify footer sections are visible", async () => {
    // Step 1: Verify footer sections
    await layout.footer.scrollIntoViewIfNeeded();
    // Expect: Footer sections are visible
    await expect(layout.productSection).toBeVisible();
    await expect(layout.companySection).toBeVisible();
    await expect(layout.trustCenterSection).toBeVisible();
    await expect(layout.connectSection).toBeVisible();
  });

  test("Verify header navigation links redirect correctly", async ({
    page,
  }) => {
    // Step 1: Click Agents Gallery
    await layout.agentsGalleryLink.click();
    // Expect: User navigates to agents gallery page
    await expect(page).toHaveURL(/agents/);

    // Step 2: Click Pricing
    await layout.pricingLink.click();
    // Expect: User navigates to pricing page
    await expect(page).toHaveURL(/pricing/);
  });
});
