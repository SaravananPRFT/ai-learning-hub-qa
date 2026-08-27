import { test as base, expect } from "@playwright/test";
import { ApiClient } from "../helpers/api-client";
import { ENV } from "../config/environments";

type AppFixtures = {
  api: ApiClient;
  ollamaAvailable: boolean;
};

export const test = base.extend<AppFixtures>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  ollamaAvailable: async ({}, use) => {
    await use(ENV.OLLAMA_AVAILABLE);
  },
});

export { expect };

export function expectOkJson(response: import("@playwright/test").APIResponse) {
  // Re-exported for convenience in test files that import from this module
  return import("../helpers/assertions").then(m => m.expectOkJson(response));
}

// Skip test when Ollama is not running
export function skipIfOllamaDown(ollamaAvailable: boolean) {
  if (!ollamaAvailable) {
    test.skip(true, "Skipped: OLLAMA_AVAILABLE=false in .env. Start Ollama and set OLLAMA_AVAILABLE=true to run this test.");
  }
}
