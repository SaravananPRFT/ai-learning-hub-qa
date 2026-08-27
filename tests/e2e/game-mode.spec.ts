import { test, expect } from "@playwright/test";
import { BasePage } from "../../pages/base.page";

// @P2

test.describe("Game Mode Toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("ai-hub-game-mode"));
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("game mode toggle button shows 'PIXEL MODE' by default @P2", async ({ page }) => {
    const toggleBtn = page.getByRole("button", { name: /pixel mode/i });
    await expect(toggleBtn).toBeVisible();
  });

  test("clicking toggle switches to game mode @P2", async ({ page }) => {
    await page.getByRole("button", { name: /pixel mode/i }).click();
    const seriousBtn = page.getByRole("button", { name: /serious mode/i });
    await expect(seriousBtn).toBeVisible();
  });

  test("game mode persists in localStorage @P2", async ({ page }) => {
    await page.getByRole("button", { name: /pixel mode/i }).click();
    const value = await page.evaluate(() => localStorage.getItem("ai-hub-game-mode"));
    expect(value).toBe("true");
  });

  test("game mode persists after page reload @P2", async ({ page }) => {
    await page.getByRole("button", { name: /pixel mode/i }).click();
    await page.reload();
    await page.waitForLoadState("networkidle");
    const seriousBtn = page.getByRole("button", { name: /serious mode/i });
    await expect(seriousBtn).toBeVisible();
  });

  test("switching back to serious mode removes game mode class @P2", async ({ page }) => {
    await page.getByRole("button", { name: /pixel mode/i }).click();
    await page.getByRole("button", { name: /serious mode/i }).click();
    const value = await page.evaluate(() => localStorage.getItem("ai-hub-game-mode"));
    expect(value).toBe("false");
  });

  test("game mode changes sidebar nav labels @P2", async ({ page }) => {
    await page.getByRole("button", { name: /pixel mode/i }).click();
    const gameModeLabel = page.getByText(/realm explorer/i).first();
    await expect(gameModeLabel).toBeVisible();
  });
});
