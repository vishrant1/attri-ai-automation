import { test, expect } from "../fixtures/baseTest";
import { AgentDetailPage } from "../pages/AgentDetailPage";

test.describe("Agent Detail Page", () => {
  let detail: AgentDetailPage;

  test.beforeEach(async ({ page }) => {
    detail = new AgentDetailPage(page);

    // Step 1: Open a valid agent detail page
    await detail.open("rapid-ap-insights-ai-service");
    // Expect: Agent detail page loads
    await expect(page).toHaveURL(/agents\//);
  });

  test("Verify agent detail page loads with core elements", async () => {
    // Step 2: Verify title
    // Expect: Agent title is visible
    await expect(detail.agentTitle).toBeVisible();

    // Step 3: Verify description
    // Expect: Agent description is visible
    await expect(detail.agentDescription).toBeVisible();

    // Step 4: Verify KPI cards
    // Expect: Exactly 4 KPI cards are displayed
    await expect(detail.kpiCards).toHaveCount(4);

    // Step 5: Verify workspace preview image
    // Expect: Workspace preview is visible
    await expect(detail.workspacePreview).toBeVisible();
  });

  test("Verify default expanded and collapsed states of collapsible sections", async () => {
    // Step 2: Verify About section default state
    // Expect: About this agent is expanded by default
    await expect(detail.aboutSection).toBeVisible();
    await expect(detail.aboutToggle).toBeVisible();

    // Step 3: Verify Challenges section default state
    const agentTitle: string = (await detail.agentTitle.textContent()) || "";
    // Expect: Challenges section is collapsed by default
    await expect(
      detail.challengesSection(agentTitle + " solves"),
    ).toBeVisible();
    await expect(detail.challengesToggle(agentTitle + " solves")).toBeVisible();

    // Step 4: Verify How it works section default state
    // Expect: How it works section is collapsed by default
    await expect(detail.howItWorksSection).toBeVisible();
    await expect(detail.howItWorksToggle).toBeVisible();
  });

  test("Verify 3-step How it works guide", async () => {
    // Step 2: Verify Step 1
    // Expect: “Use Template” step is visible
    await expect(detail.stepUseTemplate).toBeVisible();

    // Step 3: Verify Step 2
    // Expect: “Customize” step is visible
    await expect(detail.stepCustomize).toBeVisible();

    // Step 4: Verify Step 3
    // Expect: “Publish” step is visible
    await expect(detail.stepPublish).toBeVisible();
  });

  test("Verify 'More digital employees you may like' section and related agent actions", async ({
    page,
  }) => {
    // Step 2: Scroll to "More digital employees you may like" section
    await detail.relatedSection.scrollIntoViewIfNeeded();
    // Expect: Related agents section is visible
    await expect(detail.relatedSection).toBeVisible();

    // Step 3: Verify related agent cards
    // Expect: Exactly 4 related agent cards are displayed
    await expect(detail.relatedAgentCards).toHaveCount(4);

    // Step 4: Verify CTA buttons on first related agent card
    const firstRelatedCard = detail.relatedAgentCards.first();
    // Expect: Details CTA is visible
    await expect(
      firstRelatedCard.getByRole("button", { name: /details/i }),
    ).toBeVisible();

    // Expect: Build this agent CTA is visible
    await expect(
      firstRelatedCard.getByRole("button", { name: /build this agent/i }),
    ).toBeVisible();

    // Step 5: Click Details CTA
    await firstRelatedCard.getByRole("button", { name: /details/i }).click();
    // Expect: User navigates to another agent detail page
    await expect(page).toHaveURL(/agents\/.+/);
  });

  test("Verify Back to all templates navigation", async ({ page }) => {
    // Step 2: Click Back to all templates link
    await detail.backToGalleryLink.click();

    // Expect: User is redirected to agents gallery
    await expect(page).toHaveURL(/agents$/);
  });
});
