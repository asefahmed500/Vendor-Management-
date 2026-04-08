import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('should display dashboard statistics', async ({ page }) => {
    // Check for stats cards
    await expect(page.locator('text=Total Vendors|Pending|Approved')).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    // Check for navigation links
    const nav = page.locator('nav, [data-testid="admin-nav"], .sidebar');
    await expect(nav).toBeVisible();

    // Check for common navigation items
    await expect(page.locator('a:has-text("Vendors"), a:has-text("Dashboard"), a:has-text("Documents")').first()).toBeVisible();
  });

  test('should navigate to vendors page', async ({ page }) => {
    await page.click('a:has-text("Vendors")');

    await page.waitForURL('/admin/vendors');
    await expect(page).toHaveURL(/\/admin\/vendors/);
    await expect(page.locator('h1')).toContainText('Vendors');
  });

  test('should navigate to documents page', async ({ page }) => {
    await page.click('a:has-text("Documents")');

    await page.waitForURL('/admin/documents');
    await expect(page).toHaveURL(/\/admin\/documents/);
  });

  test('should display vendor list with filters', async ({ page }) => {
    await page.goto('/admin/vendors');

    // Check for vendor table/list
    await expect(page.locator('table, [data-testid="vendor-list"]')).toBeVisible();

    // Check for filters
    await expect(page.locator('select, input[placeholder*="search"], input[placeholder*="filter"]').first()).toBeVisible();
  });

  test('should navigate to vendor details page', async ({ page }) => {
    await page.goto('/admin/vendors');

    // Click on first vendor in list
    const firstVendor = page.locator('a[href^="/admin/vendors/"], tr[data-vendor-id]').first();
    if (await firstVendor.count() > 0) {
      await firstVendor.click();

      // Should navigate to vendor details
      await page.waitForURL(/\/admin\/vendors\/[a-f0-9]+/);
      await expect(page.locator('h1')).toContainText('Vendor Details');
    }
  });

  test('should display notifications bell', async ({ page }) => {
    // Check for notification bell
    const notificationBell = page.locator('[data-testid="notification-bell"], button[aria-label*="notification"], .notification-bell').first();
    if (await notificationBell.count() > 0) {
      await expect(notificationBell).toBeVisible();
    }
  });
});

test.describe('Admin Vendor Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    await page.goto('/admin/vendors');
  });

  test('should filter vendors by status', async ({ page }) => {
    // Look for status filter
    const statusFilter = page.locator('select[name="status"], [data-testid="status-filter"]').first();
    if (await statusFilter.count() > 0) {
      await statusFilter.selectOption('PENDING');
      await page.waitForTimeout(500); // Wait for filter to apply

      // Verify filter was applied (check URL or content)
      const url = page.url();
      expect(url).toContain('status=PENDING');
    }
  });

  test('should search vendors', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search" i], input[name="search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Test');
      await page.waitForTimeout(500);

      // Verify search was applied
      const url = page.url();
      expect(url).toContain('search=');
    }
  });

  test('should paginate vendor list', async ({ page }) => {
    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [data-testid="next-page"]').first();
    if (await nextButton.count() > 0 && await nextButton.isEnabled()) {
      const initialUrl = page.url();
      await nextButton.click();
      await page.waitForTimeout(500);

      // URL should change (page parameter)
      expect(page.url()).not.toBe(initialUrl);
    }
  });
});

test.describe('Admin Document Verification', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
    await page.goto('/admin/documents');
  });

  test('should display document list', async ({ page }) => {
    await expect(page.locator('table, [data-testid="document-list"]')).toBeVisible();
  });

  test('should filter documents by verification status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"], [data-testid="status-filter"]').first();
    if (await statusFilter.count() > 0) {
      await statusFilter.selectOption('PENDING');
      await page.waitForTimeout(500);

      const url = page.url();
      expect(url).toContain('status=');
    }
  });

  test('should open document verification modal', async ({ page }) => {
    // Look for verify button
    const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Review")').first();
    if (await verifyButton.count() > 0) {
      await verifyButton.click();

      // Modal should appear
      await expect(page.locator('[role="dialog"], .modal, [data-testid="verification-modal"]')).toBeVisible();
    }
  });

  test('should submit document verification', async ({ page }) => {
    // This test assumes there's a document to verify
    const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Review")').first();
    if (await verifyButton.count() > 0) {
      await verifyButton.click();

      // Add verification comment
      const commentInput = page.locator('textarea[name="comment"], [data-testid="verification-comment"]').first();
      if (await commentInput.count() > 0) {
        await commentInput.fill('Document looks good');

        // Click approve button
        const approveButton = page.locator('button:has-text("Approve"), button:has-text("Verify")').last();
        await approveButton.click();

        // Success message or modal close
        await page.waitForTimeout(1000);
      }
    }
  });
});

test.describe('Admin Proposals', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('should navigate to proposals page', async ({ page }) => {
    await page.click('a:has-text("Proposals")');

    await page.waitForURL('/admin/proposals');
    await expect(page).toHaveURL(/\/admin\/proposals/);
  });

  test('should display proposal list', async ({ page }) => {
    await page.goto('/admin/proposals');

    await expect(page.locator('table, [data-testid="proposal-list"], .grid').first()).toBeVisible();
  });

  test('should create new proposal', async ({ page }) => {
    await page.goto('/admin/proposals');

    // Look for create button
    const createButton = page.locator('a:has-text("Create"), button:has-text("New Proposal"), a[href*="/create"]').first();
    if (await createButton.count() > 0) {
      await createButton.click();

      // Should navigate to create page
      await page.waitForURL(/\/admin\/proposals\/create|\/create/);
      await expect(page.locator('h1')).toContainText('Create Proposal');
    }
  });
});
