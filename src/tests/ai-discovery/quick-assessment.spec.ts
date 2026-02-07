import { test, expect } from "../../fixtures/baseTest";
import { AIDiscoveryModal } from "../../pages/AIDiscoveryModal";
import { QuickAssessmentPage } from "../../pages/QuickAssessment";

test.describe("Quick Business Assessment Flow", () => {
  test("Complete Quick Business Assessment", async ({ page }) => {
    const modal: AIDiscoveryModal = new AIDiscoveryModal(page);
    const qaPage: QuickAssessmentPage = new QuickAssessmentPage(page);

    // Navigate to Quick Assessment
    await modal.openFromHero();
    await modal.switchToQuickAssessment();

    // Step 1: Check For the number of questions
    // Expect: 4-step questionnaire should present (progress indicated by dots at the top)
    await expect(qaPage.stepIndicators).toHaveCount(4);

    // Step 2: Check for the main questions and it's options
    // Expect: Main question should display with all options
    await expect(qaPage.questionTitle).toContainText(
      "Which part of your business do you want to improve first?",
    );
    await expect(qaPage.options).toHaveCount(6);
    await expect(qaPage.options.first()).toHaveText("Finance & Accounting");
    await expect(qaPage.options.nth(1)).toHaveText("Sales & Marketing");
    await expect(qaPage.options.nth(2)).toHaveText("Customer Service");
    await expect(qaPage.options.nth(3)).toHaveText("HR & People Ops");
    await expect(qaPage.options.nth(4)).toHaveText("Operations / Supply");
    await expect(qaPage.options.last()).toHaveText("IT / Data & Security");

    // Step 3: Check Continue button
    // Expect: Continue button should be disabled
    await expect(qaPage.continueBtn).toBeDisabled();

    // Step 4: Select any option
    await qaPage.selectOption("Finance & Accounting");
    // Expect: Continue button should be enabled
    await expect(qaPage.continueBtn).toBeEnabled();

    // Step 5: Click Continue button and validate selected option's details
    await qaPage.clickContinue();
    // Expect: Finance & Accounting-specific question should display with all options
    await expect(qaPage.questionTitle).toContainText(
      "What’s the main finance task you want to improve?",
    );
    await expect(qaPage.options).toHaveCount(5);
    await expect(qaPage.options.first()).toHaveText("Invoice Processing");
    await expect(qaPage.options.nth(1)).toHaveText("Expense Reviews");
    await expect(qaPage.options.nth(2)).toHaveText("Cash-Flow Forecasts");
    await expect(qaPage.options.nth(3)).toHaveText("Audit / Compliance");
    await expect(qaPage.options.nth(4)).toHaveText("Financial Reports");

    // Step 6: Click on the "Go back" button
    await qaPage.clickGoBack();
    // Expect: previous question should display
    await expect(qaPage.questionTitle).toContainText(
      "Which part of your business do you want to improve first?",
    );

    // Step 7: Click on the "Continue" button
    await qaPage.clickContinue();
    // Expect: Move again in next question
    await expect(qaPage.questionTitle).toContainText(
      "What’s the main finance task you want to improve?",
    );

    // Step 8: Select "Invoice Processing" option
    await qaPage.selectOption("Invoice Processing");
    await qaPage.clickContinue();

    // Step 9: Select "Spreadsheets & Docs" option
    await qaPage.selectOption("Spreadsheets & Docs");
    await qaPage.clickContinue();

    // Step 10: Select "Quicker processing" option and Cick Submit
    await qaPage.selectOption("Quicker processing");
    await qaPage.clickSubmit();

    // Step 11: Wait till "Assessment Complete" Page load
    // Expect: Assessment Complete! heading should display
    await expect(
      page.getByRole("heading", { name: "Assessment Complete!" }),
    ).toBeVisible({ timeout: 10000 });

    // Step 12: Validate agent template card
    // Expect: Agent template card should display with name, description and CTA buttons
    await expect
      .poll(async () => await modal.getRecommendationCardCount())
      .toBeGreaterThan(0);
    await expect(modal.agentName()).toBeVisible();
    await expect(modal.agentDescription()).toBeVisible();
    await expect(modal.ctaButton("Build this agent")).toBeVisible();
    await expect(modal.ctaButton("Details")).toBeVisible();
  });
});
