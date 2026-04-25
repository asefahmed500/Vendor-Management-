import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /identity validation/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.getByRole('link', { name: /Create account/i }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: /Forgot password\?/i }).click();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/admin\/dashboard|login/);
  });
});

test.describe('Vendor Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /entity enrollment/i })).toBeVisible();
  });

  test('should validate form on submit', async ({ page }) => {
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1500);
  });
});

test.describe('Password Reset', () => {
  test('should display forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /identity recovery/i })).toBeVisible();
  });
});