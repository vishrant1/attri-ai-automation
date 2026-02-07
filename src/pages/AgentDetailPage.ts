import { Page, Locator, expect } from "@playwright/test";

export class AgentDetailPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateAgentHeader() {
    await expect(this.page.locator("h1")).toBeVisible();
  }

  async validateKPICards() {
    const kpis = this.page.locator('[data-testid="kpi-card"]');
    await expect(kpis).toHaveCount(4);
  }

  async expandSection(sectionName: string) {
    await this.page.getByRole("button", { name: sectionName }).click();
  }

  async buildAgent() {
    await this.page.getByRole("button", { name: /build this agent/i }).click();
  }

  async goBackToGallery() {
    await this.page
      .getByRole("link", { name: /back to all templates/i })
      .click();
  }
}
