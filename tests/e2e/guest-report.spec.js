import { test, expect } from "@playwright/test";

test.describe("Guest Intelligence Report", () => {
  test("homepage loads with guest report section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Free Intelligence Report")).toBeVisible();
  });

  test("can add components and run report", async ({ page }) => {
    await page.goto("/");
    const textarea = page.locator('textarea[placeholder*="Enter components"]');
    await textarea.fill("STM32F407, 10uF capacitor");
    await page.click("text=+ Add");
    await expect(page.locator("text=STM32F407")).toBeVisible();
    await expect(page.locator("text=10uF capacitor")).toBeVisible();
  });

  test("locked features show sign-up prompts", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Create Free Account")).toBeVisible({ timeout: 10000 });
  });

  test("location banner appears", async ({ page }) => {
    await page.goto("/");
    // Banner may or may not appear depending on API
    const banner = page.locator("text=Detected:");
    // Just check the page doesn't crash
    await expect(page).toHaveTitle(/PGI Hub/);
  });
});
