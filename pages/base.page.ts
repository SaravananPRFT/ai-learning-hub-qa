import { Page, Locator } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  // ─── Sidebar navigation ────────────────────────────────────────────────────

  get sidebar(): Locator {
    return this.page.locator("aside").first();
  }

  navLink(label: string): Locator {
    return this.sidebar.getByRole("link", { name: label });
  }

  get gameModeToggle(): Locator {
    return this.sidebar.getByRole("button", {
      name: /pixel mode|serious mode/i,
    });
  }

  get appLogoLink(): Locator {
    return this.sidebar.getByRole("link").first();
  }

  // ─── Navigation helpers ────────────────────────────────────────────────────

  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
  }

  async enableGameMode() {
    const button = this.page.getByRole("button", { name: /pixel mode/i });
    if (await button.isVisible()) {
      await button.click();
    }
  }

  async disableGameMode() {
    const button = this.page.getByRole("button", { name: /serious mode/i });
    if (await button.isVisible()) {
      await button.click();
    }
  }

  // ─── Loading states ────────────────────────────────────────────────────────

  async waitForSpinnerGone() {
    const spinner = this.page.locator('[class*="animate-spin"]');
    if (await spinner.isVisible({ timeout: 500 }).catch(() => false)) {
      await spinner.waitFor({ state: "hidden", timeout: 15_000 });
    }
  }

  // ─── Game mode detection ───────────────────────────────────────────────────

  async isGameMode(): Promise<boolean> {
    const value = await this.page.evaluate(() =>
      localStorage.getItem("ai-hub-game-mode")
    );
    return value === "true";
  }

  async clearGameMode() {
    await this.page.evaluate(() =>
      localStorage.removeItem("ai-hub-game-mode")
    );
  }
}
