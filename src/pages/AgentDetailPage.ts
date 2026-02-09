import { Page, Locator, expect } from "@playwright/test";

export class AgentDetailPage {
  readonly page: Page;

  // Header
  readonly agentTitle: Locator;
  readonly agentDescription: Locator;

  // KPI cards
  readonly kpiCards: Locator;

  // Workspace preview
  readonly workspacePreview: Locator;

  // Collapsible sections
  readonly aboutSection: Locator;
  readonly howItWorksSection: Locator;

  readonly aboutToggle: Locator;
  readonly howItWorksToggle: Locator;

  // 3-step guide
  readonly stepUseTemplate: Locator;
  readonly stepCustomize: Locator;
  readonly stepPublish: Locator;

  // Related agents
  readonly relatedSection: Locator;
  readonly relatedAgentCards: Locator;

  // Navigation
  readonly backToGalleryLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.agentTitle = page.getByRole("heading").first();
    this.agentDescription = page.locator("p").first();

    this.kpiCards = page.locator(".grid-cols-2 .bg-slate-gray-100");

    this.workspacePreview = page.locator("img").first();

    this.aboutSection = page
      .locator("p", { hasText: "About this agent" })
      .locator("..")
      .locator("..");
    this.howItWorksSection = page
      .locator("p", { hasText: "How the agent works" })
      .locator("..")
      .locator("..");

    this.aboutToggle = this.aboutSection.getByRole("button", {
      name: /collapse section/i,
    });

    this.howItWorksToggle = this.howItWorksSection.getByRole("button", {
      name: /Expand section/i,
    });

    this.stepUseTemplate = page.getByText('CLICK "USE THIS TEMPLATE"');
    this.stepCustomize = page.getByText("CUSTOMIZE YOUR TEMPLATE");
    this.stepPublish = page.getByText("PUBLISH YOUR APP");

    this.relatedSection = page.getByText("More digital employees you may like");
    this.relatedAgentCards = page
      .locator('div[class*="gap-6"]')
      .filter({ has: page.locator('div[class*="h-[160px]"]') })
      .locator(":scope > div");

    this.backToGalleryLink = page.getByRole("link", {
      name: "Back to all templates",
    });
  }

  challengesSection(agentTitle: string) {
    return this.page
      .locator("p", { hasText: agentTitle })
      .locator("..")
      .locator("..");
  }

  challengesToggle(agentTitle: string) {
    return this.challengesSection(agentTitle).getByRole("button", {
      name: /expand section/i,
    });
  }

  async open(slug: string) {
    await this.page.goto(`/agents/${slug}`);
    await expect(this.page).toHaveURL(new RegExp(`/agents/${slug}`));
  }

  async toggleChallenges(agentTitle: string) {
    await this.challengesToggle(agentTitle).click();
  }

  async toggleHowItWorks() {
    await this.howItWorksToggle.click();
  }
}
