import { Page, Locator } from "@playwright/test";

export class LayoutPage {
  readonly page: Page;

  // Header root
  readonly header: Locator;

  // Desktop navigation links
  readonly agentsGalleryLink: Locator;
  readonly becomePartnerLink: Locator;
  readonly pricingLink: Locator;
  readonly contactUsLink: Locator;

  // Auth / CTA
  readonly loginButton: Locator;
  readonly startForFreeButton: Locator;

  // Footer sections
  readonly footer: Locator;
  readonly productSection: Locator;
  readonly companySection: Locator;
  readonly trustCenterSection: Locator;
  readonly connectSection: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header root
    this.header = page.locator("header");

    // Primary nav links (desktop)
    this.agentsGalleryLink = this.header.getByRole("link", {
      name: "Agents Gallery",
    });

    this.becomePartnerLink = this.header.getByRole("link", {
      name: "Become a Partner",
    });

    this.pricingLink = this.header.getByRole("link", {
      name: "Pricing",
    });

    this.contactUsLink = this.header.getByRole("link", {
      name: "Contact us",
    });

    // Buttons
    this.loginButton = this.header.getByRole("button", {
      name: "Login",
    });

    this.startForFreeButton = this.header.getByRole("button", {
      name: "Start for free",
    });

    // Footer
    this.footer = page.locator("footer");

    this.productSection = this.footer.getByRole("heading", {
      name: /product/i,
    });

    this.companySection = this.footer.getByRole("heading", {
      name: /company/i,
    });

    this.trustCenterSection = this.footer.getByRole("heading", {
      name: /trust center/i,
    });

    this.connectSection = this.footer.getByRole("heading", {
      name: /connect/i,
    });
  }
}
