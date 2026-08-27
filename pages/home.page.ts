import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get searchInput(): Locator {
    return this.page.getByTestId("home-search-input");
  }

  get searchSubmitButton(): Locator {
    return this.page.getByTestId("home-search-submit");
  }

  get featureCards(): Locator {
    return this.page
      .locator("section")
      .filter({ hasText: /platform features|select your realm/i })
      .getByRole("link");
  }

  get featuredTechnologies(): Locator {
    return this.page
      .locator("section")
      .filter({ hasText: /featured technologies|featured realms/i })
      .getByRole("link");
  }

  get categoryLinks(): Locator {
    return this.page
      .locator("section")
      .filter({ hasText: /browse by category/i })
      .getByRole("link");
  }

  get quickSearchChips(): Locator {
    return this.page.locator("button").filter({ hasText: /^(RAG|FastAPI|Docker|Kubernetes|Python|Embeddings|MCP|Ollama|PostgreSQL|LangChain)$/ });
  }

  get pageTitle(): Locator {
    return this.page.locator("h1");
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto("/");
    await this.waitForSpinnerGone();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchSubmitButton.click();
    await this.page.waitForURL(/\/explore/);
  }

  async quickSearch(term: string) {
    await this.page.getByRole("button", { name: term, exact: true }).click();
    await this.page.waitForURL(/\/explore/);
  }
}
