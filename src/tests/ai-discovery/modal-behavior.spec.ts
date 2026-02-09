import { test, expect } from "../../fixtures/baseTest";
import { AIDiscoveryModal } from "../../pages/AIDiscoveryModal";

test.describe("Tab Switching & Modal Behavior", () => {
  let modal: AIDiscoveryModal;

  test.beforeEach(async ({ page }) => {
    modal = new AIDiscoveryModal(page);
  });

  test("Open modal from hero and verify default tab", async ({ page }) => {
    // Step 1: Open modal from hero section
    await modal.openDiscoveryModalFromHero();
    // Expect: Modal should be visible
    await expect(modal.dialog).toBeVisible();

    // Step 2: Verify Conversational Discovery tab is default
    // Expect: Conversational Discovery tab should be selected
    await expect(
      modal.dialog.locator(modal.conversationalDiscovery.first()),
    ).toHaveClass(/bg-/);
  });

  test("Switch between Conversational Discovery and Quick Assessment tabs", async ({
    page,
  }) => {
    // Step 1: Open modal from hero
    await modal.openDiscoveryModalFromHero();
    // Expect: Modal should be visible
    await expect(modal.dialog).toBeVisible();

    // Step 2: Switch to Quick Assessment
    await modal.switchToQuickAssessment();
    // Expect: Quick Assessment tab should be selected
    await expect(
      modal.dialog.locator(modal.quickAssessment.first()),
    ).toHaveClass(/bg-/);

    // Step 3: Switch back to Conversational Discovery
    await modal.switchToConversationalDiscovery();
    // Expect: Conversational Discovery tab should be selected
    await expect(
      modal.dialog.locator(modal.conversationalDiscovery.first()),
    ).toHaveClass(/bg-/);
  });

  test("Back to all templates closes modal and returns to gallery", async ({
    page,
  }) => {
    // Step 1: Open modal
    await modal.openDiscoveryModalFromHero();
    // Expect: Modal should be visible
    await expect(modal.dialog).toBeVisible();

    // Step 2: Click Back to all templates
    await modal.backToTemplates.click();
    // Expect: Hero CTA should be visible on gallery page
    await expect(
      page.getByRole("button", { name: "Explore templates with AI" }),
    ).toBeVisible();
  });

  test("Open modal from gallery buttons under hero section", async ({
    page,
  }) => {
    // Step 1: Click Conversational Discovery button under hero
    await modal.conversationalDiscovery.first().click();
    // Expect: Conversational Discovery modal should open
    await expect(
      modal.dialog.locator(modal.conversationalDiscovery.first()),
    ).toHaveClass(/bg-/);

    // Step 2: Close modal
    await modal.backToTemplates.click();
    // Expect: Gallery hero CTA visible
    await expect(
      page.getByRole("button", { name: "Explore templates with AI" }),
    ).toBeVisible();

    // Step 3: Click Quick Assessment button under hero
    await modal.quickAssessment.first().click();
    // Expect: Quick Assessment modal should open
    await expect(
      modal.dialog.locator(modal.quickAssessment.first()),
    ).toHaveClass(/bg-/);
  });

  test("Open modal from bottom CTA section", async ({ page }) => {
    const bottomCTAHeading = page
      .getByText("Search templates with new way")
      .first();
    await bottomCTAHeading.scrollIntoViewIfNeeded();

    const bottomConversationalBtn = page
      .getByRole("button", { name: "Conversational Discovery" })
      .last();
    const bottomQuickBtn = page
      .getByRole("button", { name: "Quick Assessment" })
      .last();
    // Expect: Bottom CTA buttons should be visible
    await expect(bottomConversationalBtn).toBeVisible();
    await expect(bottomQuickBtn).toBeVisible();

    // Step 2: Open Conversational Discovery from bottom CTA
    await modal.openDiscoveryModalFromBottomConversational();
    // Expect: Conversational Discovery tab should be selected
    await expect(
      modal.dialog.locator(modal.conversationalDiscovery.first()),
    ).toHaveClass(/bg-/);

    // Step 3: Close modal
    await modal.backToTemplates.click();
    // Expect: Bottom CTA buttons should be visible again
    await expect(modal.conversationalDiscovery.last()).toBeVisible();

    // Step 4: Open Quick Assessment from bottom CTA
    await modal.openDiscoveryModalFromBottomQuickAssessment();
    // Expect: Quick Assessment tab should be selected
    await expect(
      modal.dialog.locator(modal.quickAssessment.first()),
    ).toHaveClass(/bg-/);
  });
});
