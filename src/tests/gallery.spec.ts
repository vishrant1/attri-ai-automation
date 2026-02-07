import { test, expect } from "../fixtures/baseTest";
import { AgentsGalleryPage } from "../pages/AgentsGalleryPage";

test("Agents gallery basic interactions", async ({ page }) => {
  const gallery = new AgentsGalleryPage(page);

  await gallery.open();
  await gallery.validateCardsLoaded();

  await gallery.searchAgent("Finance");
  await gallery.validateCardsLoaded();

  await gallery.filterByCategory("Finance");
  await gallery.validateCardsLoaded();

  await gallery.buildFirstAgent();
  await expect(page).toHaveURL(/login/);
});
