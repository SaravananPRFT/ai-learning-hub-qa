import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class RoadmapPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get goalInput(): Locator {
    return this.page.getByPlaceholder(/learn rag|your goal/i).or(
      this.page.getByRole("textbox").first()
    );
  }

  get generateButton(): Locator {
    return this.page.getByRole("button", { name: /generate|create roadmap/i });
  }

  get roadmapWeeks(): Locator {
    return this.page.locator("[class*='week'], .roadmap-week, h3").filter({ hasText: /week \d/i });
  }

  get experienceLevelSelect(): Locator {
    return this.page.locator("select, [role='combobox']").first();
  }

  async goto() {
    await this.page.goto("/roadmap");
    await this.page.waitForLoadState("networkidle");
  }

  async generateRoadmap(goal: string, experienceLevel?: string) {
    await this.goalInput.fill(goal);
    if (experienceLevel) {
      const select = this.experienceLevelSelect;
      if (await select.isVisible().catch(() => false)) {
        await select.selectOption(experienceLevel);
      }
    }
    await this.generateButton.click();
    await this.page.waitForResponse(
      (resp) => resp.url().includes("/roadmap/generate") && resp.status() === 200,
      { timeout: 15_000 }
    );
    await this.page.waitForLoadState("networkidle");
  }
}
