import { Locator } from "@playwright/test";

export async function waitForAICards(cards: Locator) {
  await cards.first().waitFor({ timeout: 20000 });
}
