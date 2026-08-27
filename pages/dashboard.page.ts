import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get statsCards(): Locator {
    return this.page.locator("[class*='card'], [class*='stat']").filter({ hasText: /started|completed|quiz|project/i });
  }

  get progressSection(): Locator {
    return this.page.locator("section, div").filter({ hasText: /progress|learning/i }).first();
  }

  get skillScores(): Locator {
    return this.page.locator("[class*='score'], [class*='skill']").filter({ hasText: /ai engineer|architect|developer/i });
  }

  async goto() {
    await this.page.goto("/dashboard");
    await this.page.waitForLoadState("networkidle");
    await this.waitForSpinnerGone();
  }
}
