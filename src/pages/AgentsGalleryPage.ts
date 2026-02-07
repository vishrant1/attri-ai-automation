import { Page, Locator } from "@playwright/test";

export class AgentsGalleryPage {
  readonly page: Page;

  // Hero section
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly exploreWithAIButton: Locator;

  // Search bar
  readonly searchInput: Locator;

  // Category filters
  readonly categoryFilters: Locator;

  // Agent cards
  readonly agentCards: Locator;

  // Pagination
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly pageNumbers: Locator;

  // Sections
  readonly searchTemplatesHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Hero section
    this.heroTitle = page.locator("h1").first();
    this.heroSubtitle = page.locator("p").first();
    this.exploreWithAIButton = page.getByRole("button", {
      name: "Explore templates with AI",
    });

    // Search bar
    this.searchInput = page.getByPlaceholder(/search/i);

    // Category filters - horizontal button bar
    this.categoryFilters = page.getByRole("button").filter({
      has: page.locator(
        "text=/All templates|Billing|Customer Service|Finance|Human Resources|Information Technology|Legal|Marketing|Procurement|Sales|Utilities/i",
      ),
    });

    // Agent cards
    this.agentCards = page.locator('div[class*="rounded-lg"]:has(h3)');

    // Pagination
    this.previousButton = page.getByLabel("Previous page");
    this.nextButton = page.getByLabel("Next page");
    this.pageNumbers = page.getByRole("button").filter({
      hasText: /^[0-9]+$/,
    });

    // Sections
    this.searchTemplatesHeading = page.getByText(/search templates/i).first();
  }

  async open() {
    await this.page.goto("/agents");
  }

  // Search functionality
  async searchAgent(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchInput.press("Enter");
  }

  async clearSearch() {
    await this.searchInput.fill("");
    await this.searchInput.press("Enter");
  }

  // Category filter functionality
  async filterByCategory(category: string) {
    await this.page.getByRole("button", { name: category }).click();
  }

  // Pagination functionality
  async goToNextPage() {
    await this.nextButton.click();
  }

  async goToPreviousPage() {
    await this.previousButton.click();
  }

  async goToPage(pageNumber: number) {
    await this.page.getByLabel(`Go to page ${pageNumber}`).click();
  }

  getPageButton(pageNumber: number): Locator {
    return this.page.getByLabel(`Go to page ${pageNumber}`);
  }

  getNumberedPageButton(pageNumber: string): Locator {
    return this.page.getByRole("button", { name: pageNumber, exact: true });
  }

  // Agent card interactions
  getAgentCard(index: number = 0): Locator {
    return this.agentCards.nth(index);
  }

  getAgentCardThumbnail(cardIndex: number = 0): Locator {
    return this.agentCards.nth(cardIndex).locator("img");
  }

  getAgentCardKPIBadge(cardIndex: number = 0): Locator {
    return this.agentCards.nth(cardIndex).locator(".items-center span");
  }

  getAgentCardName(cardIndex: number = 0): Locator {
    return this.agentCards.nth(cardIndex).locator("h3");
  }

  getAgentCardDescription(cardIndex: number = 0): Locator {
    return this.agentCards.nth(cardIndex).locator("p");
  }

  async clickBuildThisAgent(cardIndex: number = 0) {
    await this.agentCards
      .nth(cardIndex)
      .getByRole("button", { name: /build this agent/i })
      .click();
  }

  async clickDetails(cardIndex: number = 0) {
    await this.agentCards
      .nth(cardIndex)
      .getByRole("button", { name: /details/i })
      .click();
  }

  // Legacy methods for backward compatibility
  async openFirstAgentDetails() {
    await this.clickDetails(0);
  }

  async buildFirstAgent() {
    await this.clickBuildThisAgent(0);
  }

  async validateCardsLoaded() {
    await this.agentCards.first().waitFor({ state: "visible" });
  }
}
