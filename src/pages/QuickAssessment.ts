import { Page, Locator } from "@playwright/test";
import { AIDiscoveryModal } from "./AIDiscoveryModal";

export class QuickAssessmentPage extends AIDiscoveryModal {
  readonly page: Page;

  // POC section
  readonly explorePOC: Locator;

  // Steps indicators
  readonly stepIndicators: Locator;

  // Step-specific questions
  readonly questionTitle: Locator;
  readonly options: Locator;

  // Navigation buttons
  readonly continueBtn: Locator;
  readonly goBackBtn: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // POC section
    this.explorePOC = page.locator('a:has-text("Explore POC program")');

    // Steps indicator
    this.stepIndicators = page.locator(
      'div.flex.items-center.gap-1 > div[class*="rounded-lg"]',
    );

    // Question title
    this.questionTitle = page.locator("h2").last();

    // Options
    this.options = page.locator("div.cursor-pointer");

    // Navigation buttons
    this.continueBtn = page.locator('button:has-text("Continue")');
    this.goBackBtn = page.locator('button:has-text("Go back")');
    this.submitBtn = page.locator('button:has-text("Submit")');
  }

  // Sidebar actions
  async goToQuickAssessment() {
    await this.quickAssessment.click();
  }

  // POC section
  async explorePOCProgram() {
    await this.explorePOC.click();
  }

  // Select an option by visible text
  async selectOption(optionText: string) {
    const option = this.options.filter({ hasText: optionText });
    await option.first().click();
  }

  // Continue button
  async clickContinue() {
    await this.continueBtn.click();
  }

  // Go back button
  async clickGoBack() {
    await this.goBackBtn.click();
  }

  // Submit button
  async clickSubmit() {
    await this.submitBtn.click();
  }

  // Get current step indicators as array of colors (green = active, etc.)
  async stepIndicatorsCount() {
    // await this.stepIndicators.waitFor({ state: "visible", timeout: 10000 });
    return this.stepIndicators.count();
  }

  // Get current question title
  async getCurrentQuestion() {
    return await this.questionTitle.textContent();
  }
}
