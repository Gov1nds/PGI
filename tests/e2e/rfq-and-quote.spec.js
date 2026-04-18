import { test, expect } from "@playwright/test";

test.describe("RFQ and Quote Flow", () => {
  test("analyze page renders correctly", async ({ page }) => {
    await page.goto("/analyze");
    await expect(page.locator("text=Analysis studio")).toBeVisible();
    await expect(page.locator("text=Upload File")).toBeVisible();
    await expect(page.locator("text=Part Number")).toBeVisible();
    await expect(page.locator("text=Paste BOM")).toBeVisible();
  });

  test("pricing page renders both plans", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("text=Starter")).toBeVisible();
    await expect(page.locator("text=Enterprise")).toBeVisible();
  });

  test("marketplace page loads", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page.locator("text=Marketplace")).toBeVisible({ timeout: 10000 });
  });

  test("vendor login page renders", async ({ page }) => {
    await page.goto("/vendor/login");
    await expect(page.locator("text=Vendor Portal")).toBeVisible();
  });
});
