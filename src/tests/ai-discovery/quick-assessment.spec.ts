import { test, expect } from "../../fixtures/baseTest";
import { AIDiscoveryModal } from "../../pages/AIDiscoveryModal";
import { QuickAssessmentPage } from "../../pages/QuickAssessment";

test.describe("AI Discovery – Quick Assessment", () => {
  let modal: AIDiscoveryModal;
  let qa: QuickAssessmentPage;

  test.beforeEach(async ({ page }) => {
    modal = new AIDiscoveryModal(page);
    qa = new QuickAssessmentPage(page);

    // Step 1: Open AI Discovery modal
    await modal.openDiscoveryModalFromHero();

    // Step 2: Switch to Quick Assessment tab
    await modal.switchToQuickAssessment();
    // Expect: Quick Assessment tab is active
    await expect(qa.questionTitle).toBeVisible();
  });

  test("Verify 4-step questionnaire and initial options", async () => {
    // Step 1: Observe step indicators
    // Expect: Exactly 4 steps are shown
    await expect(qa.stepIndicators).toHaveCount(4);

    // Step 2: Observe first question
    // Expect: Correct question text is displayed
    await expect(qa.questionTitle).toContainText(
      "Which part of your business do you want to improve first?",
    );

    // Step 3: Observe available options
    // Expect: 6 business area options are displayed
    await expect(qa.options).toHaveCount(6);
  });

  test("Verify Continue button enable/disable behavior", async () => {
    // Step 1: Observe Continue button without selection
    // Expect: Continue button is disabled
    await expect(qa.continueBtn).toBeDisabled();

    // Step 2: Select a business area
    await qa.selectOption("Finance & Accounting");
    // Expect: Continue button becomes enabled
    await expect(qa.continueBtn).toBeEnabled();
  });

  test("Verify Go back button behavior from Step 2", async () => {
    // Step 1: Select Finance & Accounting
    await qa.selectOption("Finance & Accounting");
    // Expect: Option is selectable (implicit state change)
    await expect(qa.continueBtn).toBeEnabled();

    // Step 2: Click Continue
    await qa.clickContinue();
    // Expect: Finance-specific question is shown
    await expect(qa.questionTitle).toContainText(
      "What’s the main finance task you want to improve?",
    );

    // Step 3: Click Go back
    await qa.clickGoBack();
    // Expect: User returns to first question
    await expect(qa.questionTitle).toContainText(
      "Which part of your business do you want to improve first?",
    );
  });

  test("Verify full assessment completion flow", async ({ page }) => {
    // Step 1: Select Finance & Accounting
    await qa.selectOption("Finance & Accounting");
    // Expect: Continue button is enabled
    await expect(qa.continueBtn).toBeEnabled();

    // Step 2: Continue to next step
    await qa.clickContinue();
    // Expect: Finance task question is displayed
    await expect(qa.questionTitle).toContainText(
      "What’s the main finance task you want to improve?",
    );

    // Step 3: Select Invoice Processing
    await qa.selectOption("Invoice Processing");
    // Expect: Continue button is enabled
    await expect(qa.continueBtn).toBeEnabled();

    // Step 4: Continue to next step
    await qa.clickContinue();
    // Expect: Data source question is displayed
    await expect(qa.questionTitle).toBeVisible();

    // Step 5: Select Spreadsheets & Docs
    await qa.selectOption("Spreadsheets & Docs");
    // Expect: Continue button is enabled
    await expect(qa.continueBtn).toBeEnabled();

    // Step 6: Continue to final step
    await qa.clickContinue();
    // Expect: Goal selection question is displayed
    await expect(qa.questionTitle).toBeVisible();

    // Step 7: Select Quicker processing
    await qa.selectOption("Quicker processing");
    // Expect: Submit button is enabled
    await expect(qa.submitBtn).toBeEnabled();

    // Step 8: Submit assessment
    await qa.clickSubmit();
    // Expect: Assessment Complete screen appears
    await expect(
      page.getByRole("heading", { name: "Assessment Complete!" }),
    ).toBeVisible({ timeout: 10000 });
  });

  test("Verify recommended agent templates and CTAs", async ({ page }) => {
    // Step 1: Complete assessment flow
    await qa.selectOption("Finance & Accounting");
    await qa.clickContinue();

    await qa.selectOption("Invoice Processing");
    await qa.clickContinue();

    await qa.selectOption("Spreadsheets & Docs");
    await qa.clickContinue();

    await qa.selectOption("Quicker processing");
    await qa.clickSubmit();

    // Expect: Assessment completion page is visible
    await expect(
      page.getByRole("heading", { name: "Assessment Complete!" }),
    ).toBeVisible({ timeout: 10000 });

    // Step 2: Observe recommendation cards
    // Expect: At least one recommended agent is shown
    await expect
      .poll(async () => await modal.getRecommendationCardCount())
      .toBeGreaterThan(0);

    // Step 3: Observe agent card content
    // Expect: Agent name and description are visible
    await expect(modal.agentName()).toBeVisible();
    await expect(modal.agentDescription()).toBeVisible();

    // Step 4: Observe CTA buttons
    // Expect: Build and Details buttons are visible
    await expect(modal.ctaButton("Build this agent")).toBeVisible();
    await expect(modal.ctaButton("Details")).toBeVisible();
  });
});
