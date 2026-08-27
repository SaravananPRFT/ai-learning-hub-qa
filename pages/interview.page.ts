import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class InterviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get topicInput(): Locator {
    return this.page.getByPlaceholder(/topic|technology|rag|docker/i).first();
  }

  get generateQuestionsButton(): Locator {
    return this.page.getByRole("button", { name: /generate|start/i }).first();
  }

  get questionsList(): Locator {
    return this.page.locator("[class*='question'], li").filter({ hasText: /\?/ });
  }

  get answerTextarea(): Locator {
    return this.page.getByRole("textbox").last();
  }

  get evaluateButton(): Locator {
    return this.page.getByRole("button", { name: /evaluate|submit/i }).last();
  }

  get evaluationResult(): Locator {
    return this.page.locator("[class*='score'], [class*='evaluation'], [class*='result']").first();
  }

  async goto() {
    await this.page.goto("/interview");
    await this.page.waitForLoadState("networkidle");
  }

  async generateQuestions(topic: string) {
    await this.topicInput.fill(topic);
    await this.generateQuestionsButton.click();
    await this.page.waitForResponse(
      (resp) => resp.url().includes("/interview/questions") && resp.status() === 200,
      { timeout: 60_000 }
    );
    await this.page.waitForLoadState("networkidle");
  }
}
