import { expect, Locator } from "@playwright/test";

export async function assertCardsRendered(cards: Locator) {
  await expect(cards).toHaveCount(1);
}
