import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// @P1 — WCAG 2.2 AA critical violations only

const CRITICAL_IMPACT = ["critical", "serious"] as const;

async function runAxeOnPage(page: import("@playwright/test").Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500); // allow client-side hydration

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const criticalViolations = results.violations.filter((v) =>
    CRITICAL_IMPACT.includes(v.impact as typeof CRITICAL_IMPACT[number])
  );

  return { violations: results.violations, criticalViolations };
}

test.describe("Accessibility — WCAG 2.2 AA", () => {
  test("Home page has zero critical/serious axe violations @P1", async ({ page }) => {
    const { criticalViolations } = await runAxeOnPage(page, "/");
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join("\n");
      expect(criticalViolations, `Critical violations found:\n${summary}`).toHaveLength(0);
    }
  });

  test("Explore page has zero critical/serious axe violations @P1", async ({ page }) => {
    const { criticalViolations } = await runAxeOnPage(page, "/explore");
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join("\n");
      expect(criticalViolations, `Critical violations found:\n${summary}`).toHaveLength(0);
    }
  });

  test("Concept detail page has zero critical/serious axe violations @P1", async ({ page }) => {
    const { criticalViolations } = await runAxeOnPage(page, "/explore/rag");
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join("\n");
      expect(criticalViolations, `Critical violations found:\n${summary}`).toHaveLength(0);
    }
  });

  test("Mentor page has zero critical/serious axe violations @P1", async ({ page }) => {
    const { criticalViolations } = await runAxeOnPage(page, "/mentor");
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join("\n");
      expect(criticalViolations, `Critical violations found:\n${summary}`).toHaveLength(0);
    }
  });

  test("Dashboard page has zero critical/serious axe violations @P2", async ({ page }) => {
    const { criticalViolations } = await runAxeOnPage(page, "/dashboard");
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join("\n");
      expect(criticalViolations, `Critical violations found:\n${summary}`).toHaveLength(0);
    }
  });

  test("Roadmap page has zero critical/serious axe violations @P2", async ({ page }) => {
    const { criticalViolations } = await runAxeOnPage(page, "/roadmap");
    if (criticalViolations.length > 0) {
      const summary = criticalViolations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join("\n");
      expect(criticalViolations, `Critical violations found:\n${summary}`).toHaveLength(0);
    }
  });
});
