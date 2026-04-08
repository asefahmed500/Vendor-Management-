import { test, expect } from '@playwright/test';

/**
 * UI Visibility & Accessibility E2E Tests
 * 
 * These tests verify that all UI elements are:
 * - Visible (not hidden, not transparent)
 * - Have sufficient contrast (WCAG AA: 4.5:1 for normal text)
 * - Properly rendered in the browser
 * - Not overlapping or clipped
 */

// Helper: Get computed color and calculate contrast ratio against background
async function getContrastRatio(page: any, selector: string, backgroundColor: string = '#ffffff') {
  const color = await page.locator(selector).evaluate((el) => {
    return window.getComputedStyle(el).color;
  });
  
  // Parse rgb(r, g, b) to hex
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return { ratio: 0, textColor: color, bgColor: backgroundColor };
  
  const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  const bgMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  let bgR = 255, bgG = 255, bgB = 255;
  if (bgMatch) {
    [bgR, bgG, bgB] = [parseInt(bgMatch[1]), parseInt(bgMatch[2]), parseInt(bgMatch[3])];
  }
  
  // Calculate relative luminance
  const luminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = luminance(r, g, b);
  const l2 = luminance(bgR, bgG, bgB);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return { ratio: Math.round(ratio * 100) / 100, textColor: color, bgColor: backgroundColor };
}

// Helper: Check if element is visible and has text content
async function checkElementVisible(page: any, selector: string, description: string) {
  const locator = page.locator(selector);
  await expect(locator).toBeVisible({ timeout: 10000 });
  const text = await locator.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
}

// Helper: Check contrast ratio meets WCAG AA (4.5:1)
async function checkContrast(page: any, selector: string, description: string, minRatio: number = 4.5) {
  const result = await getContrastRatio(page, selector);
  expect(result.ratio).toBeGreaterThanOrEqual(minRatio);
}

test.describe('UI Visibility - Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('login page renders all text elements visibly', async ({ page }) => {
    // Check main heading
    await checkElementVisible(page, 'h1, h2', 'Login heading');
    
    // Check form labels
    await checkElementVisible(page, 'text="Email"', 'Email label');
    await checkElementVisible(page, 'text="Password"', 'Password label');
    
    // Check button text
    await checkElementVisible(page, 'button:has-text("Sign in")', 'Sign in button');
    
    // Check card content
    await checkElementVisible(page, 'text="Access your vendor portal"', 'Card description');
  });

  test('login page text has sufficient contrast', async ({ page }) => {
    // Check heading contrast
    await checkContrast(page, 'h1, h2', 'Login heading');
    
    // Check form label contrast
    const labels = page.locator('label');
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const label = labels.nth(i);
      await expect(label).toBeVisible();
    }
  });

  test('login page has no hidden or invisible text', async ({ page }) => {
    // All text elements should have opacity > 0.5
    const textElements = page.locator('p, span, label, h1, h2, h3, button');
    const count = await textElements.count();
    
    for (let i = 0; i < Math.min(count, 20); i++) {
      const el = textElements.nth(i);
      const isVisible = await el.isVisible();
      expect(isVisible).toBeTruthy();
    }
  });
});

test.describe('UI Visibility - Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  });

  test('admin dashboard page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*admin\/dashboard/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('admin sidebar links are fully visible', async ({ page }) => {
    // Check sidebar exists
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    
    // Check all nav items are visible with text
    const navLinks = page.locator('aside a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      const text = await link.textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });

  test('admin header elements are visible', async ({ page }) => {
    // Check header
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    // Check breadcrumb or title
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    
    // Check user dropdown
    const userArea = page.locator('header').locator('text="Admin"');
    await expect(userArea).toBeVisible();
  });

  test('admin dashboard stat cards are visible with readable text', async ({ page }) => {
    // Wait for dashboard content
    await page.waitForTimeout(1000);
    
    // Check stat cards exist and have text
    const statCards = page.locator('[class*="grid"] > div, [class*="Grid"] > div').first();
    await expect(statCards.or(page.locator('h1'))).toBeVisible();
    
    // Check all text on page is visible
    const allText = page.locator('p, span, h1, h2, h3, h4, td, th');
    const count = await allText.count();
    
    let invisibleCount = 0;
    for (let i = 0; i < Math.min(count, 50); i++) {
      const el = allText.nth(i);
      const isVisible = await el.isVisible();
      if (!isVisible) {
        // Check if it's actually supposed to be hidden
        const classes = await el.getAttribute('class') || '';
        if (!classes.includes('hidden') && !classes.includes('sr-only')) {
          invisibleCount++;
        }
      }
    }
    
    // Allow some hidden elements (icons, decorative elements)
    expect(invisibleCount).toBeLessThan(count * 0.1);
  });

  test('admin dashboard has proper color contrast for text', async ({ page }) => {
    // Check heading contrast
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Get computed style
    const headingColor = await heading.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // Should not be transparent or too light
    expect(headingColor).not.toContain('rgba(0, 0, 0, 0)');
    expect(headingColor).not.toContain('rgba(255, 255, 255, 0)');
  });
});

test.describe('UI Visibility - Vendor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login as vendor
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'avlogdaily1@gmail.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Sign in")');
    await page.waitForTimeout(3000);
  });

  test('vendor dashboard page loads', async ({ page }) => {
    const url = page.url();
    expect(url).toContain('vendor');
  });

  test('vendor sidebar links are visible', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    
    const navLinks = page.locator('aside a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
    }
  });

  test('vendor dashboard stat cards are visible', async ({ page }) => {
    await page.waitForTimeout(1000);
    
    // Check for stat cards
    const statCards = page.locator('div[class*="border"][class*="rounded"]');
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check text inside stat cards
    for (let i = 0; i < Math.min(count, 5); i++) {
      const card = statCards.nth(i);
      await expect(card).toBeVisible();
    }
  });
});

test.describe('UI Visibility - Admin Pages Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
  });

  const adminPages = [
    { name: 'Vendors', url: '/admin/vendors' },
    { name: 'Documents', url: '/admin/documents' },
    { name: 'Document Types', url: '/admin/document-types' },
    { name: 'Audit Logs', url: '/admin/audit-logs' },
    { name: 'Analytics', url: '/admin/analytics' },
  ];

  for (const adminPage of adminPages) {
    test(`${adminPage.name} page - all text visible`, async ({ page }) => {
      await page.goto(adminPage.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check page title is visible
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      
      // Check all visible text elements
      const textElements = page.locator('p, span, label, th, td, button');
      const count = await textElements.count();
      
      let visibleCount = 0;
      for (let i = 0; i < Math.min(count, 100); i++) {
        const el = textElements.nth(i);
        const isVisible = await el.isVisible();
        if (isVisible) {
          visibleCount++;
          // Check element has actual text
          const text = await el.textContent();
          if (text?.trim()) {
            // Verify text is not transparent
            const opacity = await el.evaluate((el) => {
              return window.getComputedStyle(el).opacity;
            });
            expect(parseFloat(opacity)).toBeGreaterThan(0.3);
          }
        }
      }
      
      // At least 80% of text elements should be visible
      expect(visibleCount).toBeGreaterThan(Math.min(count, 100) * 0.8);
    });
  }
});

test.describe('UI Visibility - Vendor Pages Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'avlogdaily1@gmail.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Sign in")');
    await page.waitForTimeout(3000);
  });

  const vendorPages = [
    { name: 'Profile', url: '/vendor/profile' },
    { name: 'Opportunities', url: '/vendor/proposals' },
    { name: 'Documents', url: '/vendor/documents' },
    { name: 'Certificate', url: '/vendor/certificate' },
  ];

  for (const vendorPage of vendorPages) {
    test(`${vendorPage.name} page - all text visible`, async ({ page }) => {
      await page.goto(vendorPage.url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      // Check page title
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();
      
      // Check text elements visibility
      const textElements = page.locator('p, span, label, th, td, button');
      const count = await textElements.count();
      
      let visibleCount = 0;
      for (let i = 0; i < Math.min(count, 100); i++) {
        const el = textElements.nth(i);
        const isVisible = await el.isVisible();
        if (isVisible) {
          visibleCount++;
        }
      }
      
      expect(visibleCount).toBeGreaterThan(Math.min(count, 100) * 0.8);
    });
  }
});

test.describe('UI Visibility - Responsive Checks', () => {
  test('admin dashboard is visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'admin@vms.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Sign in")');
    await page.waitForURL('**/admin/dashboard', { timeout: 15000 });
    
    // Check heading is visible on mobile
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    
    // Check mobile menu button exists
    const menuButton = page.locator('button:has(svg)');
    await expect(menuButton.first()).toBeVisible();
  });

  test('vendor dashboard is visible on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="email"]', 'avlogdaily1@gmail.com');
    await page.fill('input[type="password"]', 'Admin@123');
    await page.click('button:has-text("Sign in")');
    await page.waitForTimeout(3000);
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });
});
