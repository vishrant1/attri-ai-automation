import { Page, Locator, expect } from "@playwright/test";
import { AIDiscoveryModal } from "./AIDiscoveryModal";

/**
 * Page Object Model for Conversational Discovery Chat interface
 * Handles all locators, helper methods, and error-handled actions
 */
export class ConversationalDiscovery extends AIDiscoveryModal {
  readonly page: Page;

  /** Input field for sending user messages to AI */
  readonly chatInput: Locator;

  /** AI "thinking..." indicator while processing a response */
  readonly thinkingIndicator: Locator;

  /** All AI recommendation cards returned after conversation */

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.chatInput = page.getByPlaceholder("Write your message here...");
    this.thinkingIndicator = page.getByText(/thinking.../i);
  }

  // -------------------
  // Basic Locators
  // -------------------

  /** Locator for AI response container messages */
  aiResponse(): Locator {
    return this.page.locator(".space-y-4 .justify-start");
  }

  /** Locator for all quick reply buttons */
  quickReplyChoiceButtons(): Locator {
    const container = this.page.locator(".space-y-4 .gap-2");
    return container.getByRole("button");
  }

  // -------------------
  // Helper Methods with Error Handling
  // -------------------

  /** Sends a message to AI chat input */
  async sendMessage(message: string) {
    try {
      await this.chatInput.waitFor({ state: "visible", timeout: 5000 });
      await this.chatInput.fill(message);
      await this.chatInput.press("Enter");
    } catch (error) {
      throw new Error(
        `Failed to send message: "${message}". Chat input might not be visible or interactable. Original Error: ${error}`,
      );
    }
  }

  /** Waits for AI "thinking..." indicator to appear and disappear */
  async waitForAIResponse() {
    try {
      // Wait a short time for 'thinking...' to appear (non-strict)
      const visible = await this.thinkingIndicator
        .waitFor({ state: "visible", timeout: 2000 })
        .catch(() => false); // if not visible, ignore

      // Wait for it to disappear (max 30s)
      await this.thinkingIndicator.waitFor({ state: "hidden", timeout: 30000 });
    } catch (error) {
      throw new Error(
        `AI response timed out or unexpected behavior for 'thinking...' indicator. Original Error: ${error}`,
      );
    }
  }

  /** Verifies AI Recommendation header is visible */
  async verifyRecommendationHeaderVisible() {
    try {
      const header = this.page.getByText(
        "Your Personalized AI Agent Recommendations",
      );
      await header.isVisible();
      return header;
    } catch (error) {
      throw new Error(
        "Recommendation header not visible. AI might have failed to return results. Original Error: " +
          error,
      );
    }
  }

  async waitForLatestAIResponse() {
    const latestResponse = this.page.locator(".space-y-4 > div").last();
    await latestResponse.waitFor({ state: "visible", timeout: 30000 });
  }

  /**
   * Returns only the latest AI response container that has quick reply buttons
   */
  quickReplyContainerLatest(): Locator {
    return this.page.locator(".space-y-4 > div:has(button)").last();
  }

  /**
   * Returns quick reply buttons from the latest AI response only
   */
  quickReplyChoiceButtonsLatest(): Locator {
    return this.quickReplyContainerLatest().getByRole("button");
  }

  /**
   * Waits for the latest quick reply buttons to appear
   */
  async waitForLatestQuickReplies(timeout = 30000) {
    const container: Locator = this.quickReplyContainerLatest();
    await container.waitFor({ state: "visible", timeout });
    const buttons: Locator = container.getByRole("button");
    await buttons.first().isVisible({ timeout });
  }
}
