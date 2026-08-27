import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class MentorPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ──────────────────────────────────────────────────────────────

  get personaList(): Locator {
    return this.page.locator("[data-testid^='persona-']");
  }

  personaButton(personaId: string): Locator {
    return this.page.getByTestId(`persona-${personaId}`);
  }

  get contextInput(): Locator {
    return this.page.getByPlaceholder(/e.g. rag, transformers/i);
  }

  get chatInput(): Locator {
    return this.page.getByTestId("mentor-chat-input");
  }

  get sendButton(): Locator {
    return this.page.getByTestId("mentor-send-button");
  }

  get chatMessages(): Locator {
    return this.page.locator(".flex.gap-3");
  }

  get assistantMessages(): Locator {
    return this.page.locator(".flex.gap-3.justify-start");
  }

  get userMessages(): Locator {
    return this.page.locator(".flex.gap-3.justify-end");
  }

  get typingIndicator(): Locator {
    return this.page.locator(".animate-bounce").first();
  }

  get ollamaSetupBanner(): Locator {
    return this.page.getByText(/ollama model not ready/i);
  }

  get quickActionButtons(): Locator {
    return this.page.locator("button").filter({ hasText: /explain this concept|give me a quiz|show me a project|what should i learn/i });
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  async goto(contextSlug?: string) {
    const url = contextSlug ? `/mentor?context=${contextSlug}` : "/mentor";
    await this.page.goto(url);
    await this.page.waitForLoadState("networkidle");
  }

  async selectPersona(personaName: string) {
    await this.page.getByRole("button", { name: personaName }).click();
  }

  async selectPersonaById(personaId: string) {
    await this.personaButton(personaId).click();
  }

  async sendMessage(text: string) {
    await this.chatInput.fill(text);
    await this.sendButton.click();
    await this.waitForResponse();
  }

  async sendQuickAction(actionText: string) {
    await this.page.getByRole("button", { name: actionText }).click();
    await this.waitForResponse();
  }

  async waitForResponse(timeout = 20_000) {
    // Wait for typing indicator to appear then disappear
    await this.typingIndicator
      .waitFor({ state: "visible", timeout: 5_000 })
      .catch(() => {});
    await this.typingIndicator
      .waitFor({ state: "hidden", timeout })
      .catch(() => {});
  }

  async getPersonaNames(): Promise<string[]> {
    return this.personaList.allTextContents();
  }

  async getLastAssistantMessage(): Promise<string> {
    const messages = this.assistantMessages;
    const count = await messages.count();
    return messages.nth(count - 1).textContent() ?? "";
  }
}
