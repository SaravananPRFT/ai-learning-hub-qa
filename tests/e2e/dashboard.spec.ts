import { test, expect } from "@playwright/test";
import { DashboardPage } from "../../pages/dashboard.page";

// @smoke @P1

test.describe("Dashboard Page", () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();
  });

  test("page loads without errors @smoke", async ({ page }) => {
    await expect(page).not.toHaveURL(/error|404/);
  });

  test("page title or heading is visible @smoke", async ({ page }) => {
    const heading = page.getByRole("heading").first();
    await expect(heading).toBeVisible();
  });

  test("navigating to dashboard via sidebar works @P1", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
