import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export type ConceptTab =
  | "Overview"
  | "Architecture"
  | "Code"
  | "Projects"
  | "Experiments"
  | "Interview Q's"
  | "Resources";

export type DepthLevel = "beginner" | "intermediate" | "advanced";

export class ConceptDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get conceptTitle(): Locator {
    return this.page.locator("h1").first();
  }

  get conceptDescription(): Locator {
    return this.page.locator("p.text-sm.text-muted-foreground").first();
  }

  get breadcrumbExplorerLink(): Locator {
    return this.page.getByRole("link", { name: /explorer/i });
  }

  get tabBar(): Locator {
    return this.page.locator(".flex.gap-1.border-b");
  }

  tab(name: ConceptTab): Locator {
    return this.page.getByRole("button", { name, exact: true });
  }

  get activeTab(): Locator {
    return this.page.locator("button.border-primary");
  }

  get depthSelector(): Locator {
    return this.page.locator(".flex.gap-1\\.5").filter({ hasText: /beginner/i }).first();
  }

  depthButton(level: DepthLevel): Locator {
    return this.page.getByRole("button", { name: level, exact: true }).first();
  }

  get prerequisiteLinks(): Locator {
    return this.page
      .locator(".w-72")
      .locator("a[href^='/explore/']")
      .first();
  }

  get relatedConceptLinks(): Locator {
    return this.page
      .locator(".w-72")
      .getByRole("link")
      .filter({ hasText: /\S/ });
  }

  get askMentorButton(): Locator {
    return this.page.getByRole("link", { name: /ask ai mentor about this/i });
  }

  get notFoundHeading(): Locator {
    return this.page.getByRole("heading", { name: /concept not found/i });
  }

  get backToExplorerLink(): Locator {
    return this.page.getByRole("link", { name: /back to explorer/i });
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async goto(slug: string) {
    await this.page.goto(`/explore/${slug}`);
    await this.waitForConceptLoaded();
  }

  async waitForConceptLoaded() {
    await this.page.waitForLoadState("networkidle");
    await this.waitForSpinnerGone();
  }

  async clickTab(name: ConceptTab) {
    await this.tab(name).click();
  }

  async selectDepth(level: DepthLevel) {
    await this.depthButton(level).click();
  }

  async getTabNames(): Promise<string[]> {
    const tabs = this.page.locator(".flex.gap-1.border-b button");
    return tabs.allTextContents();
  }
}
