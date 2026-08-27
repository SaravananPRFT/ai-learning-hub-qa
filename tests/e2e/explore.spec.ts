import { test, expect } from "@playwright/test";
import { ExplorePage } from "../../pages/explore.page";

// @smoke @regression @P0

test.describe("Concept Explorer Page", () => {
  let explorePage: ExplorePage;

  test.beforeEach(async ({ page }) => {
    explorePage = new ExplorePage(page);
    await explorePage.goto();
  });

  test("loads with search bar and concept grid @smoke", async () => {
    await expect(explorePage.searchInput).toBeVisible();
    const count = await explorePage.getConceptCardCount();
    expect(count).toBeGreaterThan(0);
  });

  test("displays concept count text @smoke", async () => {
    await expect(explorePage.conceptCountText).toBeVisible();
  });

  test("search returns filtered results @smoke", async ({ page }) => {
    const totalBefore = await explorePage.getConceptCardCount();

    await explorePage.search("rag");

    await expect(page).toHaveURL(/q=rag/i);
    const countAfter = await explorePage.getConceptCardCount();
    // After filtering, result count should change or stay same but must be >= 1
    expect(countAfter).toBeGreaterThanOrEqual(1);
  });

  test("search for unknown term shows empty state", async () => {
    await explorePage.search("xyznonexistentconcept999");
    await expect(explorePage.emptyStateHeading).toBeVisible();
  });

  test("generate button appears when no results found", async () => {
    await explorePage.search("thisconceptdoesnotexistxyz");
    await expect(explorePage.generateButton).toBeVisible();
  });

  test("difficulty filter narrows results @regression", async () => {
    const totalBefore = await explorePage.getConceptCardCount();
    await explorePage.applyDifficultyFilter("beginner");
    const countAfter = await explorePage.getConceptCardCount();
    expect(countAfter).toBeLessThanOrEqual(totalBefore);
  });

  test("clear button removes active filters @regression", async ({ page }) => {
    await explorePage.applyDifficultyFilter("beginner");
    await expect(explorePage.clearFiltersButton).toBeVisible();
    await explorePage.clearAllFilters();
    await expect(page).toHaveURL(/\/explore$/);
  });

  test("clicking a concept card navigates to detail page @smoke", async ({ page }) => {
    await explorePage.conceptCards.first().click();
    await expect(page).toHaveURL(/\/explore\/.+/);
    await page.waitForLoadState("networkidle");
  });

  test("concept cards display category badge", async () => {
    const firstCard = explorePage.conceptCards.first();
    const categoryBadge = firstCard.locator("span").filter({ hasText: /\w+/ }).first();
    await expect(categoryBadge).toBeVisible();
  });

  test("concept cards display difficulty badge", async () => {
    const firstCard = explorePage.conceptCards.first();
    const diffBadge = firstCard.locator("span").filter({ hasText: /beginner|intermediate|advanced|expert/i }).first();
    await expect(diffBadge).toBeVisible();
  });

  test("URL syncs with search query", async ({ page }) => {
    await explorePage.search("fastapi");
    await expect(page).toHaveURL(/q=fastapi/i);
  });

  test("navigating to explore with ?q= pre-fills search", async ({ page }) => {
    await page.goto("/explore?q=python");
    await expect(explorePage.searchInput).toHaveValue("python");
  });
});
