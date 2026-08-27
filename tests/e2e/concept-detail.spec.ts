import { test, expect } from "@playwright/test";
import { ConceptDetailPage } from "../../pages/concept-detail.page";
import { PRIMARY_SLUG, UNKNOWN_SLUG } from "../../helpers/test-data";

// @smoke @regression @P0

const EXPECTED_TABS = [
  "Overview",
  "Architecture",
  "Code",
  "Projects",
  "Experiments",
  "Interview Q's",
  "Resources",
] as const;

test.describe("Concept Detail Page", () => {
  let detailPage: ConceptDetailPage;

  test.beforeEach(async ({ page }) => {
    detailPage = new ConceptDetailPage(page);
  });

  test("loads valid concept and renders title @smoke", async () => {
    await detailPage.goto(PRIMARY_SLUG);
    await expect(detailPage.conceptTitle).toBeVisible();
    const title = await detailPage.conceptTitle.textContent();
    expect(title?.length).toBeGreaterThan(0);
  });

  test("renders all 7 tabs @smoke", async () => {
    await detailPage.goto(PRIMARY_SLUG);
    for (const tab of EXPECTED_TABS) {
      await expect(detailPage.tab(tab)).toBeVisible();
    }
  });

  test("shows breadcrumb with Explorer link @smoke", async () => {
    await detailPage.goto(PRIMARY_SLUG);
    await expect(detailPage.breadcrumbExplorerLink).toBeVisible();
  });

  test("breadcrumb Explorer link navigates back @regression", async ({ page }) => {
    await detailPage.goto(PRIMARY_SLUG);
    await detailPage.breadcrumbExplorerLink.click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test("Overview tab is active by default @smoke", async () => {
    await detailPage.goto(PRIMARY_SLUG);
    const activeTabText = await detailPage.activeTab.textContent();
    expect(activeTabText).toMatch(/overview/i);
  });

  test("tab switching changes content @regression", async ({ page }) => {
    await detailPage.goto(PRIMARY_SLUG);

    // Click Architecture tab
    await detailPage.clickTab("Architecture");
    const activeText = await detailPage.activeTab.textContent();
    expect(activeText).toMatch(/architecture/i);
  });

  test("Overview tab shows depth selector (beginner/intermediate/advanced)", async () => {
    await detailPage.goto(PRIMARY_SLUG);
    await expect(detailPage.depthButton("beginner")).toBeVisible();
    await expect(detailPage.depthButton("intermediate")).toBeVisible();
    await expect(detailPage.depthButton("advanced")).toBeVisible();
  });

  test("depth selector switches explanation content @regression", async ({ page }) => {
    await detailPage.goto(PRIMARY_SLUG);
    // The depth text blocks are only for specific slugs (like 'rag')
    // Check that clicking intermediate changes the selected state
    await detailPage.selectDepth("intermediate");
    const intermediateBtn = detailPage.depthButton("intermediate");
    await expect(intermediateBtn).toHaveClass(/blue/);
  });

  test("Ask AI Mentor button is present and links to mentor @regression", async ({ page }) => {
    await detailPage.goto(PRIMARY_SLUG);
    const mentorLink = detailPage.askMentorButton;
    await expect(mentorLink).toBeVisible();
    const href = await mentorLink.getAttribute("href");
    expect(href).toContain("/mentor");
    expect(href).toContain(PRIMARY_SLUG);
  });

  test("shows 404 state for unknown slug @smoke", async () => {
    await detailPage.goto(UNKNOWN_SLUG);
    await expect(detailPage.notFoundHeading).toBeVisible();
  });

  test("back to explorer link works from 404 state", async ({ page }) => {
    await detailPage.goto(UNKNOWN_SLUG);
    await detailPage.backToExplorerLink.click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test("concept shows description text", async () => {
    await detailPage.goto(PRIMARY_SLUG);
    await expect(detailPage.conceptDescription).toBeVisible();
  });
});
