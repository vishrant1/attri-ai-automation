import { Locator } from "@playwright/test";
import { test, expect } from "../../fixtures/baseTest";
import { AIDiscoveryModal } from "../../pages/AIDiscoveryModal";
import { ConversationalDiscovery } from "../../pages/ConversationalDiscovery";

test.describe("AI Discovery – Conversational Discovery", () => {
  test("User gets AI agent recommendations via conversation with dynamic quick replies", async ({
    page,
  }) => {
    const modal: AIDiscoveryModal = new AIDiscoveryModal(page);
    const chat: ConversationalDiscovery = new ConversationalDiscovery(page);

    // Step 1: Open AI Discovery modal
    await modal.openFromHero();
    // Expect: Modal is visible
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    // Step 2: Verify Conversational Discovery tab selected
    // Expect: Tab has highlight (bg class)
    await expect(
      page.getByRole("button", { name: /Conversational/i }),
    ).toHaveClass(/bg-/);

    // Step 3: Send initial business problem
    const problemStatement: string =
      "We want to automated Resume Screening System";
    await chat.sendMessage(problemStatement);
    await chat.waitForAIResponse();
    // Expect: Verify AI response contains expected keywords
    await expect(chat.aiResponse()).toContainText(/resume|screening/i);

    // Step 4 & 5: Handle dynamic quick replies until recommendation header appears
    const maxRetries: number = 5;
    let retry: number = 0;

    while (retry < maxRetries) {
      // if recommendations already appeared, stop
      const headerVisible: boolean = await chat.page
        .getByText("Your Personalized AI Agent Recommendations")
        .isVisible()
        .catch(() => false);

      if (headerVisible) break;

      // Wait for latest quick replies
      await chat.waitForLatestQuickReplies();

      const quickReplyButtons: Locator = chat.quickReplyChoiceButtonsLatest();
      const quickReplyCount: number = await quickReplyButtons.count();

      if (quickReplyCount === 0) {
        await chat.waitForAIResponse(); // fallback
      } else {
        // Click random button from the latest response
        const randomIndex = Math.floor(Math.random() * quickReplyCount);
        const randomQuickReply = quickReplyButtons.nth(randomIndex);
        await randomQuickReply.click();
        await chat.waitForAIResponse();
      }

      retry++;
    }

    if (retry === maxRetries) {
      throw new Error(
        "Exceeded maximum retries handling dynamic quick replies. AI may be stuck.",
      );
    }

    // Step 6: Verify AI Recommendation header
    // Expect: Header is visible
    await expect(await chat.verifyRecommendationHeaderVisible()).toBeVisible();

    // Step 7: Verify Recommendation Cards
    const cardCount: number = await modal.getRecommendationCardCount();
    // Expect: At least one card exists with name, description, and CTA buttons
    expect(cardCount).toBeGreaterThan(0);

    for (let i = 0; i < cardCount; i++) {
      await expect(chat.agentName(i)).toBeVisible();
      await expect(chat.agentDescription(i)).toBeVisible();
      await expect(chat.ctaButton("Build this agent", i)).toBeVisible();
      await expect(chat.ctaButton("Details", i)).toBeVisible();
    }

    // Step 9: Click a random CTA button and validate navigation
    const randomCTA: Locator = await modal.randomCTAButton();
    const btnText: string = (await randomCTA.innerText()).toLowerCase();

    await randomCTA.scrollIntoViewIfNeeded();
    await randomCTA.click();

    // Wait a short period for SPA navigation effect
    await page.waitForTimeout(2000);

    const currentUrl: string = page.url();
    // Expect: User is redirected based on button clicked
    if (btnText.includes("build")) {
      expect(currentUrl).toContain("sign-in");
    } else if (btnText.includes("details")) {
      expect(currentUrl).toContain("/agents/");
    }
  });
});
