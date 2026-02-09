import { Page, Locator } from "@playwright/test";

export class LayoutPage {
  readonly page: Page;

  // Header root
  readonly header: Locator;

  // Logo
  readonly logoLink: Locator;

  // Desktop navigation links
  readonly agentsGalleryLink: Locator;
  readonly becomePartnerLink: Locator;
  readonly pricingLink: Locator;
  readonly contactUsLink: Locator;

  // Auth / CTA
  readonly loginButton: Locator;
  readonly startForFreeButton: Locator;

  // Mobile specific
  readonly mobileMenuButton: Locator;
  readonly bookDemoButton: Locator;

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

    // Logo (anchor wrapping SVG)
    this.logoLink = this.header.getByRole("link").first();

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

    // Mobile-only controls
    this.mobileMenuButton = this.header.getByRole("button", {
      name: /open menu/i,
    });

    this.bookDemoButton = this.header.getByRole("button", {
      name: /book a demo/i,
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
