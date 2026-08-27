import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class ComparePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get presetCards(): Locator {
    return this.page.locator("[class*='preset'], button, [class*='card']").filter({ hasText: /vector|rag|python|llm|container|data/i });
  }

  get compareResults(): Locator {
    return this.page.locator("[class*='comparison'], [class*='result']").first();
  }

  async goto() {
    await this.page.goto("/compare");
    await this.page.waitForLoadState("networkidle");
  }
}
