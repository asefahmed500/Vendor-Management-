import { FullConfig } from '@playwright/test';

/**
 * E2E Global Setup
 *
 * Sets up the test environment before running Playwright tests.
 * This runs once before all tests.
 */

async function globalSetup(config: FullConfig) {
  console.log('🔧 Setting up E2E test environment...');

  // Set test environment variables
  process.env.PLAYWRIGHT_TEST = 'true';

  // Log configuration
  const baseURL = config.webServer?.url || 'http://localhost:3000';
  console.log(`📍 Base URL: ${baseURL}`);
  console.log(`📍 Workers: ${config.workers || 'default'}`);

  // In a real setup, you would:
  // 1. Connect to a test database
  // 2. Seed test data (admin user, test vendors)
  // 3. Clear any existing test data
  //
  // For now, we rely on the existing .env.local credentials:
  // - Admin: admin@vms.com / Admin@123
  // - Test vendors are created during test runs

  console.log('✅ E2E test environment ready');
}

export default globalSetup;
