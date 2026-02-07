import { Page, Locator } from "@playwright/test";

export class AIDiscoveryModal {
  readonly page: Page;
  //   readonly modal: Locator;
  readonly recommendationCards: Locator;

  // Sidebar buttons
  readonly backToTemplates: Locator;
  readonly conversationalDiscovery: Locator;
  readonly quickAssessment: Locator;

  constructor(page: Page) {
    this.page = page;
    // this.modal = page.locator('[role="dialog"]');
    this.recommendationCards = page.locator('[class*="h-[212px]"]');

    // Sidebar buttons
    this.backToTemplates = page.locator(
      'button:has-text("Back to all templates")',
    );
    this.conversationalDiscovery = page.locator(
      'button:has-text("Conversational Discovery")',
    );
    this.quickAssessment = page.locator('button:has-text("Quick Assessment")');
  }

  async openFromHero() {
    await this.page
      .getByRole("button", { name: "Explore templates with AI" })
      .click();
    await this.page.locator('[role="dialog"]').waitFor();
  }

  async switchToQuickAssessment() {
    await this.page.getByRole("button", { name: "Quick Assessment" }).click();
  }

  async switchToConversationalDiscovery() {
    await this.page
      .getByRole("button", { name: "Conversational Discovery" })
      .click();
  }

  async openFromBottomConversational() {
    await this.page
      .getByRole("button", { name: "Conversational Discovery" })
      .last()
      .click();
    await this.page.locator('[role="dialog"]').waitFor();
  }

  async openFromBottomQuickAssessment() {
    await this.page
      .getByRole("button", { name: "Quick Assessment" })
      .last()
      .click();
    await this.page.locator('[role="dialog"]').waitFor();
  }

  async close() {
    await this.page
      .getByRole("button", { name: "Back to all templates" })
      .click();
  }

  /** Returns the count of AI recommendation cards */
  async getRecommendationCardCount(): Promise<number> {
    try {
      return await this.recommendationCards.count();
    } catch (error) {
      throw new Error(
        "Failed to retrieve recommendation card count. Original Error: " +
          error,
      );
    }
  }

  /**
   * Returns a random CTA button from a random recommendation card
   * Useful for dynamic testing of 'Build this agent' and 'Details'
   */
  async randomCTAButton(): Promise<Locator> {
    try {
      const count = await this.getRecommendationCardCount();
      if (count === 0)
        throw new Error(
          "No recommendation cards found to select a CTA button.",
        );

      const randomCardIndex: number = Math.floor(Math.random() * count);
      const card: Locator = this.recommendationCards.nth(randomCardIndex);

      const buttons = card.locator("button");
      const btnCount = await buttons.count();
      if (btnCount === 0)
        throw new Error(
          `No CTA buttons found in recommendation card #${randomCardIndex + 1}`,
        );

      const randomBtnIndex: number = Math.floor(Math.random() * btnCount);
      return buttons.nth(randomBtnIndex);
    } catch (error) {
      throw new Error(
        "Failed to get random CTA button. Original Error: " + error,
      );
    }
  }

  /** Locator for agent name inside a recommendation card */
  agentName(cardIndex = 0): Locator {
    return this.recommendationCards.nth(cardIndex).locator("h3");
  }

  /** Locator for agent description inside a recommendation card */
  agentDescription(cardIndex = 0): Locator {
    return this.recommendationCards.nth(cardIndex).locator("p");
  }

  /** Locator for a CTA button inside a specific recommendation card */
  ctaButton(buttonName: string, cardIndex = 0): Locator {
    return this.recommendationCards
      .nth(cardIndex)
      .getByRole("button", { name: buttonName });
  }
}
