import { test, expect } from '@playwright/test';

test.describe('Vendor Onboarding Flow', () => {
  test('should allow vendor registration', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test@123');
    await page.fill('input[name="confirmPassword"]', 'Test@123');
    await page.fill('input[name="companyName"]', 'Test Company');
    await page.fill('input[name="contactPerson"]', 'John Doe');
    await page.fill('input[name="phone"]', '+1234567890');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/login');
  });

  test('should login approved vendor', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'Vendor@123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/vendor/dashboard');
  });

  test('should display vendor dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'vendor@example.com');
    await page.fill('input[name="password"]', 'Vendor@123');
    await page.click('button[type="submit"]');

    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Status')).toBeVisible();
  });
});
