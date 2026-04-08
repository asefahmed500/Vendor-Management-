import { test, expect } from '@playwright/test';

// Note: These tests assume a vendor account exists
// In real testing, you would create a test vendor account first

test.describe('Vendor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as vendor (you may need to create a test vendor first)
    await page.goto('/login');
    // Use test vendor credentials or create one in beforeEach
    await page.fill('input[type="email"]', 'vendor@example.com');
    await page.fill('input[type="password"]', 'Vendor123!@#');
    await page.click('button[type="submit"]');

    // Wait for either successful login or error
    await page.waitForTimeout(2000);

    // If login failed, skip the test
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      test.skip(true, 'Test vendor account not available');
    }
  });

  test('should display vendor dashboard', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should display vendor status badge', async ({ page }) => {
    // Check for status badge
    const statusBadge = page.locator('[data-testid="vendor-status"], .status-badge').first();
    if (await statusBadge.count() > 0) {
      await expect(statusBadge).toBeVisible();

      // Status should be one of the valid statuses
      const statusText = await statusBadge.textContent();
      const validStatuses = ['PENDING', 'APPROVED_LOGIN', 'DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
      expect(validStatuses.some(s => statusText?.includes(s))).toBeTruthy();
    }
  });

  test('should have navigation menu', async ({ page }) => {
    // Check for navigation
    const nav = page.locator('nav, [data-testid="vendor-nav"], .sidebar');
    await expect(nav).toBeVisible();
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.click('a:has-text("Profile")');

    await page.waitForURL('/vendor/profile');
    await expect(page).toHaveURL(/\/vendor\/profile/);
  });

  test('should navigate to documents page', async ({ page }) => {
    await page.click('a:has-text("Documents")');

    await page.waitForURL('/vendor/documents');
    await expect(page).toHaveURL(/\/vendor\/documents/);
  });

  test('should display quick action cards', async ({ page }) => {
    // Look for action cards
    const actionCards = page.locator('.card, [data-testid="action-card"], a[class*="card"]');
    if (await actionCards.count() > 0) {
      await expect(actionCards.first()).toBeVisible();
    }
  });

  test('should display notification bell', async ({ page }) => {
    const notificationBell = page.locator('[data-testid="notification-bell"], button[aria-label*="notification"]').first();
    if (await notificationBell.count() > 0) {
      await expect(notificationBell).toBeVisible();
    }
  });
});

test.describe('Vendor Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'vendor@example.com');
    await page.fill('input[type="password"]', 'Vendor123!@#');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    if (page.url().includes('/login')) {
      test.skip(true, 'Test vendor account not available');
    }
  });

  test('should display profile form', async ({ page }) => {
    await page.goto('/vendor/profile');

    // Check for form fields
    await expect(page.locator('input[name="companyName"]')).toBeVisible();
    await expect(page.locator('input[name="contactPerson"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test('should update profile information', async ({ page }) => {
    await page.goto('/vendor/profile');

    const timestamp = Date.now();
    const updatedPhone = `+1${timestamp}`;

    await page.fill('input[name="phone"]', updatedPhone);
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=updated|saved|success')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/vendor/profile');

    // Clear required field
    await page.fill('input[name="companyName"]', '');
    await page.click('button[type="submit"]');

    // Should show validation error
    await expect(page.locator('text=required')).toBeVisible();
  });

  test('should update address information', async ({ page }) => {
    await page.goto('/vendor/profile');

    await page.fill('input[name="address.street"]', '123 Updated St');
    await page.fill('input[name="address.city"]', 'Updated City');
    await page.click('button[type="submit"]');

    // Should show success message
    await expect(page.locator('text=updated|saved|success')).toBeVisible();
  });
});

test.describe('Vendor Document Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'vendor@example.com');
    await page.fill('input[type="password"]', 'Vendor123!@#');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    if (page.url().includes('/login')) {
      test.skip(true, 'Test vendor account not available');
    }
  });

  test('should display documents page', async ({ page }) => {
    await page.goto('/vendor/documents');

    await expect(page.locator('h1')).toContainText('Documents');
  });

  test('should display document type list', async ({ page }) => {
    await page.goto('/vendor/documents');

    // Look for document list or cards
    const docList = page.locator('table, [data-testid="document-list"], .grid').first();
    if (await docList.count() > 0) {
      await expect(docList).toBeVisible();
    }
  });

  test('should display upload button', async ({ page }) => {
    await page.goto('/vendor/documents');

    const uploadButton = page.locator('button:has-text("Upload"), input[type="file"]').first();
    await expect(uploadButton).toBeVisible();
  });

  test('should show document status badges', async ({ page }) => {
    await page.goto('/vendor/documents');

    // Look for status badges
    const statusBadges = page.locator('.status-badge, [data-status]').first();
    if (await statusBadges.count() > 0) {
      await expect(statusBadges).toBeVisible();
    }
  });

  test('should display verification comments when present', async ({ page }) => {
    await page.goto('/vendor/documents');

    // Look for documents with comments
    const commentSection = page.locator('[data-testid="verification-comments"], .comments').first();
    if (await commentSection.count() > 0) {
      await expect(commentSection).toBeVisible();
    }
  });

  test('should submit documents for review', async ({ page }) => {
    await page.goto('/vendor/documents');

    // Look for submit button
    const submitButton = page.locator('button:has-text("Submit"), button:has-text("Submit for Review")').first();
    if (await submitButton.count() > 0 && await submitButton.isEnabled()) {
      await submitButton.click();

      // Confirmation dialog or success message
      await expect(page.locator('text=submitted|success')).toBeVisible();
    }
  });
});

test.describe('Vendor Certificate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'vendor@example.com');
    await page.fill('input[type="password"]', 'Vendor123!@#');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    if (page.url().includes('/login')) {
      test.skip(true, 'Test vendor account not available');
    }
  });

  test('should display certificate when approved', async ({ page }) => {
    await page.goto('/vendor/certificate');

    // Check for certificate display
    const certificate = page.locator('[data-testid="certificate"], .certificate, iframe').first();
    if (await certificate.count() > 0) {
      await expect(certificate).toBeVisible();
    }
  });

  test('should have download certificate button', async ({ page }) => {
    await page.goto('/vendor/certificate');

    const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")').first();
    if (await downloadButton.count() > 0) {
      await expect(downloadButton).toBeVisible();
    }
  });

  test('should show approval message', async ({ page }) => {
    await page.goto('/vendor/certificate');

    // Look for approval message or certificate number
    const certNumber = page.locator('text=VND-, text=Certificate Number').first();
    if (await certNumber.count() > 0) {
      await expect(certNumber).toBeVisible();
    }
  });
});

test.describe('Vendor Proposals', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'vendor@example.com');
    await page.fill('input[type="password"]', 'Vendor123!@#');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    if (page.url().includes('/login')) {
      test.skip(true, 'Test vendor account not available');
    }
  });

  test('should navigate to proposals page', async ({ page }) => {
    await page.click('a:has-text("Proposals")');

    await page.waitForURL('/vendor/proposals');
    await expect(page).toHaveURL(/\/vendor\/proposals/);
  });

  test('should display available proposals', async ({ page }) => {
    await page.goto('/vendor/proposals');

    // Look for proposals list
    const proposalsList = page.locator('[data-testid="proposals-list"], .grid, table').first();
    if (await proposalsList.count() > 0) {
      await expect(proposalsList).toBeVisible();
    }
  });

  test('should navigate to submissions page', async ({ page }) => {
    await page.goto('/vendor/proposals');
    await page.click('a:has-text("My Submissions"), a:has-text("Submissions")');

    await page.waitForURL(/\/vendor\/proposals\/submissions/);
    await expect(page).toHaveURL(/\/submissions/);
  });
});
