import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class ExplorePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get searchInput(): Locator {
    return this.page.getByPlaceholder(/search concepts, technologies/i);
  }

  get clearSearchButton(): Locator {
    return this.page.locator("button").filter({ has: this.page.locator('svg[class*="lucide-x"]') }).first();
  }

  get conceptCards(): Locator {
    return this.page.locator(".grid > a[href^='/explore/']");
  }

  get loadingSkeleton(): Locator {
    return this.page.locator(".animate-pulse").first();
  }

  get emptyStateHeading(): Locator {
    return this.page.getByRole("heading", { name: /no concepts found/i });
  }

  get generateButton(): Locator {
    return this.page.getByRole("button", { name: /generate/i });
  }

  get clearFiltersButton(): Locator {
    return this.page.getByRole("button", { name: /clear/i });
  }

  get conceptCountText(): Locator {
    return this.page.locator("p").filter({ hasText: /concept.* in the knowledge base/i });
  }

  difficultyFilter(level: string): Locator {
    return this.page.getByRole("button", { name: level, exact: true });
  }

  categoryFilter(category: string): Locator {
    return this.page.getByRole("button", { name: category, exact: true });
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async goto(query?: string) {
    const url = query ? `/explore?q=${encodeURIComponent(query)}` : "/explore";
    await this.page.goto(url);
    await this.waitForConceptsLoaded();
  }

  async waitForConceptsLoaded() {
    await this.page.waitForLoadState("networkidle");
    // Wait for skeleton to disappear if present
    const skeleton = this.page.locator(".animate-pulse").first();
    if (await skeleton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await skeleton.waitFor({ state: "hidden", timeout: 15_000 });
    }
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Wait for debounce (300ms) and API response
    await this.page.waitForResponse(
      (resp) => resp.url().includes("/concepts/search") && resp.status() === 200,
      { timeout: 10_000 }
    );
    await this.waitForConceptsLoaded();
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForResponse(
      (resp) => resp.url().includes("/concepts/search"),
      { timeout: 10_000 }
    );
    await this.waitForConceptsLoaded();
  }

  async applyDifficultyFilter(level: string) {
    await this.difficultyFilter(level).click();
    await this.waitForConceptsLoaded();
  }

  async applyCategoryFilter(category: string) {
    await this.categoryFilter(category).click();
    await this.waitForConceptsLoaded();
  }

  async clearAllFilters() {
    await this.clearFiltersButton.click();
    await this.waitForConceptsLoaded();
  }

  async getConceptCardCount(): Promise<number> {
    return this.conceptCards.count();
  }

  async clickFirstConceptCard() {
    await this.conceptCards.first().click();
    await this.page.waitForLoadState("networkidle");
  }
}
