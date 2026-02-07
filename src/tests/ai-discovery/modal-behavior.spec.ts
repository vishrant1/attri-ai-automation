import { test, expect } from "../../fixtures/baseTest";
import { AIDiscoveryModal } from "../../pages/AIDiscoveryModal";

test.describe("Tab Switching & Modal Behavior", () => {
  test("Users can switch between tabs and close modal from different entry points", async ({
    page,
  }) => {
    const modal: AIDiscoveryModal = new AIDiscoveryModal(page);

    // Step 1: Open modal from Hero section
    await modal.openFromHero();
    // Expect: Modal is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Step 2: Verify Conversational Discovery tab is default selected
    // Expect: Conversational Discovery tab should be default selected
    await expect(
      page.getByRole("button", { name: "Conversational Discovery" }).first(),
    ).toHaveClass(/bg-/);

    // Step 3: Switch to Quick Assessment tab
    await modal.switchToQuickAssessment();
    // Expect: Quick Assessment interface should selected
    await expect(
      page.getByRole("button", { name: "Quick Assessment" }),
    ).toHaveClass(/bg-/);

    // Step 4: Move to "All templates" page
    await modal.backToTemplates.click();
    // Expect: Main page should display
    await expect(
      page.getByRole("button", { name: "Explore templates with AI" }),
    ).toBeVisible();

    // Step 5: "Conversational discovery" and "Quick assessment" buttons should be visible
    // Expect: "Conversational discovery" and "Quick assessment" buttons should be visible below "Explore templates with AI"
    await expect(
      page.getByRole("button", { name: "Conversational Discovery" }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Quick Assessment" }).first(),
    ).toBeVisible();

    // Step 6: Switch to Conversational Discovery tab from above location
    await page
      .getByRole("button", { name: "Conversational Discovery" })
      .first()
      .click();
    // Expect: Conversational Discovery interface should display
    await expect(
      page.getByRole("button", { name: "Conversational Discovery" }).first(),
    ).toHaveClass(/bg-/);

    // Step 7: Switch to Quick Assessment tab from above location
    await modal.backToTemplates.click();
    await page
      .getByRole("button", { name: "Quick Assessment" })
      .first()
      .click();
    // Expect: Quick Assessment interface should display
    await expect(
      page.getByRole("button", { name: "Quick Assessment" }),
    ).toHaveClass(/bg-/);

    // Step 8: Move to main page and scroll down till "Search templates with new way" tab.
    await modal.backToTemplates.click();
    await page
      .getByText("Search templates with new way")
      .first()
      .scrollIntoViewIfNeeded();
    // Expect: "Conversational discovery" and "Quick assessment" buttons should display here.
    await expect(
      page.getByRole("button", { name: "Conversational Discovery" }).last(),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Quick Assessment" }).last(),
    ).toBeVisible();

    // Step 9: Switch to Conversational Discovery tab from above location
    await page
      .getByRole("button", { name: "Conversational Discovery" })
      .last()
      .click();
    // Expect: Conversational Discovery interface should display
    await expect(
      page.getByRole("button", { name: "Conversational Discovery" }).first(),
    ).toHaveClass(/bg-/);

    // Step 10: Switch to Quick Assessment tab from above location
    await modal.backToTemplates.click();
    await page.getByRole("button", { name: "Quick Assessment" }).last().click();
    // Expect: Quick Assessment interface should display
    await expect(
      page.getByRole("button", { name: "Quick Assessment" }),
    ).toHaveClass(/bg-/);
  });
});
