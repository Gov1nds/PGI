import { test, expect } from "@playwright/test";

test.describe("Chat and Offer Flow", () => {
  test("public pages have correct navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("text=Analyze")).toBeVisible();
    await expect(page.locator("text=Marketplace")).toBeVisible();
    await expect(page.locator("text=Insights")).toBeVisible();
  });

  test("insights page renders", async ({ page }) => {
    await page.goto("/insights");
    await expect(page.locator("text=Procurement intelligence")).toBeVisible();
  });

  test("contact page renders", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("text=Talk to the PGI team")).toBeVisible();
  });

  test("404 page renders for unknown routes", async ({ page }) => {
    await page.goto("/nonexistent-page");
    await expect(page.locator("text=Page not found")).toBeVisible();
  });

  test("privacy page renders", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Privacy/);
  });

  test("terms page renders", async ({ page }) => {
    await page.goto("/terms");
    await expect(page).toHaveTitle(/Terms/);
  });
});
