import { Locator } from "@playwright/test";
import { test, expect } from "../fixtures/baseTest";
import { AgentsGalleryPage } from "../pages/AgentsGalleryPage";

test.describe("Agents Gallery — Listing Page", () => {
  test("Verify all gallery page elements and functionality", async ({
    page,
  }) => {
    const gallery: AgentsGalleryPage = new AgentsGalleryPage(page);

    // Step 1: Navigate to Agents Gallery page
    await gallery.open();
    await expect(page).toHaveURL(/\/agents/);

    // Step 2: Verify Hero section elements
    // Expect: Hero section should display with title, subtitle, and "Explore templates with AI" CTA
    await expect(gallery.heroTitle).toBeVisible();
    await expect(gallery.heroSubtitle).toBeVisible();
    await expect(gallery.exploreWithAIButton).toBeVisible();
    await expect(gallery.exploreWithAIButton).toHaveText(
      /Explore templates with AI/i,
    );

    // Scroll to "Search templates" section to view cards and features below
    await gallery.searchTemplatesHeading.scrollIntoViewIfNeeded();

    // Step 3: Verify Search bar
    // Expect: Search bar should be visible
    await expect(gallery.searchInput).toBeVisible();

    // Step 4: Verify Category filters - Horizontal button bar with 11 options
    // Expect: All 11 category filter buttons should be visible
    const categories = [
      "All templates",
      "Billing",
      "Customer Service",
      "Finance",
      "Human Resources",
      "Information Technology",
      "Legal",
      "Marketing",
      "Procurement",
      "Sales",
      "Utilities",
    ];

    for (const category of categories) {
      await expect(page.getByRole("button", { name: category })).toBeVisible();
    }

    // Step 5: Verify Agent cards are loaded
    // Expect: 10 agent cards should be visible per page
    await expect(gallery.agentCards).toHaveCount(10, { timeout: 30000 });

    // Step 6: Verify agent card
    const firstCard = gallery.getAgentCard(0);
    // Expect: it should have thumbnail image, KPI metric badge, agent name, description, "Build this agent" button, "Details" button
    await expect(gallery.getAgentCardThumbnail(0)).toBeVisible();
    await expect(gallery.getAgentCardKPIBadge(0)).toBeVisible();
    await expect(gallery.getAgentCardName(0)).toBeVisible();
    await expect(gallery.getAgentCardDescription(0)).toBeVisible();
    await expect(
      firstCard.getByRole("button", { name: /build this agent/i }),
    ).toBeVisible();
    await expect(
      firstCard.getByRole("button", { name: /details/i }),
    ).toBeVisible();

    // Step 7: Verify Pagination elements and total pages
    const totalPages: number = await gallery.pageNumbers.count();
    // Expect: Pagination with Previous/Next arrows and numbered pages should be visible
    await expect(gallery.nextButton).toBeVisible();
    expect(totalPages).toBeGreaterThan(0);

    // Step 8: Verify agent cards per page
    let currentCardCount: number = await gallery.agentCards.count();
    // Expect: Should have exactly 10 agent cards per page
    expect(currentCardCount).toBe(10);

    // Step 9: Test Search bar functionality with keyword
    await gallery.searchAgent("Invoice");
    await page.waitForLoadState("networkidle");
    // Expect: Agent templates should be filtered by search keyword
    await expect(gallery.agentCards.first()).toBeVisible({ timeout: 15000 });
    await expect(gallery.agentCards).not.toHaveCount(0);
    const searchCardCount: number = await gallery.agentCards.count();
    expect(searchCardCount).toBeGreaterThan(0);

    // Step 10: Test pagination - Navigate to next page
    await gallery.open();
    await page.waitForLoadState("networkidle");
    await gallery.nextButton.scrollIntoViewIfNeeded();
    await gallery.goToNextPage();
    await page.waitForLoadState("networkidle");

    const page2Button = gallery.getPageButton(2);
    // Expect: Page 2 should load with 10 new agent cards and in pagination 2 should be highlighted
    await expect(gallery.agentCards.first()).toBeVisible({ timeout: 15000 });
    await expect(page2Button).toHaveAttribute("aria-current", "page");

    // Step 11: Test pagination - Navigate to previous page
    await gallery.previousButton.scrollIntoViewIfNeeded();
    await gallery.goToPreviousPage();
    await page.waitForLoadState("networkidle");

    const page1Button = gallery.getNumberedPageButton("1");
    // Expect: Should return to page 1
    await expect(gallery.agentCards.first()).toBeVisible({ timeout: 15000 });

    // Step 12: Click "Build this agent" button on any gallery card
    await gallery.clickBuildThisAgent(0);
    // Expect: Should navigate to Sign In page (unauthenticated user)
    await expect(page).toHaveURL(/sign-in/i);

    // Step 13: Click "Details" button
    await gallery.open();
    await page.waitForLoadState("networkidle");
    await gallery.clickDetails(0);
    // Expect: Should navigate to the corresponding agent detail page
    await expect(page).toHaveURL(/\/agents\//);
  });
});
