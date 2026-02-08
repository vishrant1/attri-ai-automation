import { test, expect } from "../fixtures/baseTest";
import { AgentsGalleryPage } from "../pages/AgentsGalleryPage";

test.describe("Agents Gallery", () => {
  let gallery: AgentsGalleryPage;

  test.beforeEach(async ({ page }) => {
    gallery = new AgentsGalleryPage(page);
  });

  test("Verify Agents Gallery page loads with all core UI elements", async () => {
    // Step 1: Verify core UI elements
    // Expect: Core UI elements are visible
    await expect(gallery.heroTitle).toBeVisible();
    await expect(gallery.heroSubtitle).toBeVisible();
    await expect(gallery.exploreWithAIButton).toBeVisible();
    await expect(gallery.searchInput).toBeVisible();
    await expect(gallery.categoryFilters.first()).toBeVisible();
    await expect(gallery.agentCards.first()).toBeVisible();
    await expect(gallery.agentCards).toHaveCount(10);
    await expect(gallery.nextButton).toBeVisible();
    await expect(gallery.getPageButton(1)).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("Verify agent card structure and navigation actions", async ({
    page,
  }) => {
    // Step 1: Verify first agent card structure
    // Expect: All card elements are visible
    await expect(gallery.getAgentCard(0)).toBeVisible();
    await expect(gallery.getAgentCardThumbnail(0)).toBeVisible();
    await expect(gallery.getAgentCardKPIBadge(0)).toBeVisible();
    await expect(gallery.getAgentCardName(0)).toBeVisible();
    await expect(gallery.getAgentCardDescription(0)).toBeVisible();

    // Step 2: Click Details on first card
    await gallery.clickDetails(0);
    // Expect: User navigates to agent detail page
    await expect(page).toHaveURL(/agents\//);

    // Step 3: Navigate back
    await page.goBack();
    // Expect: Agents gallery page is displayed again
    await expect(page).toHaveURL(/agents/);

    // Step 4: Click Build this agent
    await gallery.clickBuildThisAgent(0);
    // Expect: User is redirected to Sign In page
    await expect(page).toHaveURL(/sign/i);
  });

  test("Verify search functionality filters agents correctly", async () => {
    // Step 1: Enter valid keyword in search
    await gallery.searchAgent("finance");
    await gallery.page.waitForLoadState("networkidle");
    // Expect: Filtered agent cards are visible
    await expect(gallery.agentCards.first()).toBeVisible();

    // Step 2: Verify pagination behavior based on results
    const resultCount: number = await gallery.agentCards.count();

    if (resultCount > 10) {
      // Expect: Page 1 is active
      await expect(gallery.getPageButton(1)).toHaveAttribute(
        "aria-current",
        "page",
      );
    } else {
      // Expect: Pagination is not visible
      await expect(gallery.nextButton).toHaveCount(0);
    }

    // Step 3: Enter invalid keyword
    await gallery.searchAgent("randomnotfoundtext");
    // Expect: No agent cards are displayed
    await expect(gallery.agentCards).toHaveCount(0);

    // Expect: Pagination is not visible
    await expect(gallery.nextButton).toHaveCount(0);
  });

  test("Verify category filters update agent list correctly", async () => {
    // Step 1: Click Finance category
    await gallery.filterByCategory("Finance");
    // Expect: Filtered agents are displayed
    await expect(gallery.agentCards.first()).toBeVisible();
    // Expect: Pagination shows page 1
    await expect(gallery.getPageButton(1)).toHaveAttribute(
      "aria-current",
      "page",
    );
    // Expect: Page 3 exists
    await expect(gallery.getPageButton(3)).toBeVisible();

    // Step 2: Click Marketing category
    await gallery.filterByCategory("Marketing");
    // Expect: Marketing agents are displayed
    await expect(gallery.agentCards.first()).toBeVisible();

    // Step 3: Click All templates
    await gallery.filterByCategory("All templates");
    await gallery.page.waitForLoadState("networkidle");
    // Expect: Full agent list is displayed
    await expect(gallery.agentCards.first()).toBeVisible();

    // Step 4: Verify pagination behavior for all templates
    const cardCount = await gallery.agentCards.count();
    if (cardCount >= 10) {
      // Expect: Pagination is visible
      await expect(gallery.nextButton).toBeVisible();
    } else {
      // Expect: Pagination is not visible
      await expect(gallery.nextButton).toHaveCount(0);
    }
  });

  test("Verify pagination navigation across agent pages", async () => {
    // Step 1: Check if pagination exists
    const cardCount = await gallery.agentCards.count();

    if (cardCount < 10) {
      // Expect: Pagination is not visible
      await expect(gallery.nextButton).toHaveCount(0);
      return;
    }

    // Step 2: Verify page 1 is active
    await expect(gallery.getPageButton(1)).toHaveAttribute(
      "aria-current",
      "page",
    );
    // Expect: Previous button is disabled on first page
    await expect(gallery.previousButton).toBeDisabled();

    // Step 3: Click Next
    await gallery.goToNextPage();
    // Expect: Page 2 is active
    await expect(gallery.getPageButton(2)).toHaveAttribute(
      "aria-current",
      "page",
    );
    // Expect: Previous button is enabled
    await expect(gallery.previousButton).toBeEnabled();

    // Step 4: Navigate to last page
    await gallery.goToPage(10);
    // Expect: Page 10 is active
    await expect(gallery.getPageButton(10)).toHaveAttribute(
      "aria-current",
      "page",
    );
    // Expect: Next button is disabled on last page
    await expect(gallery.nextButton).toBeDisabled();

    // Step 5: Click Previous
    await gallery.goToPreviousPage();
    // Expect: Page 9 is active
    await expect(gallery.getPageButton(9)).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
