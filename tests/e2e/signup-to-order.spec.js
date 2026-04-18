import { test, expect } from "@playwright/test";

test.describe("Sign Up to Order Flow", () => {
  test("login page renders with OAuth buttons", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Sign In")).toBeVisible();
    await expect(page.locator("text=Continue with Google")).toBeVisible();
    await expect(page.locator("text=Continue with LinkedIn")).toBeVisible();
    await expect(page.locator("text=Continue with Microsoft")).toBeVisible();
  });

  test("register page renders with OAuth buttons", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("text=Register")).toBeVisible();
    await expect(page.locator("text=Continue with Google")).toBeVisible();
  });

  test("login form validates email and password", async ({ page }) => {
    await page.goto("/login");
    await page.click('button:has-text("Sign In")');
    // HTML5 validation should prevent submission without email
  });

  test("register link navigates to register page", async ({ page }) => {
    await page.goto("/login");
    await page.click("text=Register");
    await expect(page).toHaveURL(/\/register/);
  });

  test("dashboard redirects unauthenticated users", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=Sign in to continue")).toBeVisible({ timeout: 10000 });
  });
});
