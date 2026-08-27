import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/home.page";

// @smoke @P0

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("loads with correct page title @smoke", async ({ page }) => {
    await expect(page).toHaveTitle(/AI Learning Hub/i);
  });

  test("renders navigation sidebar with all links @smoke", async () => {
    const expectedLinks = [
      "Home",
      "Concept Explorer",
      "Knowledge Graph",
      "Learning Roadmap",
      "Projects",
      "Experiment Lab",
      "AI Mentor",
      "Interview Practice",
      "Comparisons",
      "Skill Assessment",
      "Dashboard",
    ];
    for (const label of expectedLinks) {
      await expect(homePage.navLink(label)).toBeVisible();
    }
  });

  test("renders hero search input @smoke", async () => {
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchSubmitButton).toBeVisible();
  });

  test("renders platform feature cards @smoke", async () => {
    const cards = homePage.featureCards;
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("renders featured technologies section", async () => {
    const featured = homePage.featuredTechnologies;
    const count = await featured.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("renders category browse section", async () => {
    const categories = homePage.categoryLinks;
    const count = await categories.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("game mode toggle button is visible", async () => {
    await expect(homePage.gameModeToggle).toBeVisible();
  });

  test("search from hero navigates to explore page @smoke", async ({ page }) => {
    await homePage.searchInput.fill("RAG");
    await homePage.searchSubmitButton.click();
    await expect(page).toHaveURL(/\/explore\?q=RAG/i);
  });

  test("quick search chip navigates to explore with query", async ({ page }) => {
    await homePage.quickSearch("Docker");
    await expect(page).toHaveURL(/\/explore\?q=Docker/i);
  });

  test("clicking feature card navigates to correct route", async ({ page }) => {
    const conceptExplorerCard = page.getByRole("link", { name: /concept explorer/i }).first();
    await conceptExplorerCard.click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test("sidebar logo link navigates to home", async ({ page }) => {
    await page.goto("/explore");
    await homePage.appLogoLink.click();
    await expect(page).toHaveURL("/");
  });
});
