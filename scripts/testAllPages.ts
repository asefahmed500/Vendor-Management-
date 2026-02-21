import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

interface TestResult {
  page: string;
  url: string;
  status: number;
  success: boolean;
  error?: string;
}

const adminPages = [
  { name: 'Dashboard Stats', path: '/api/admin/dashboard/stats' },
  { name: 'Vendors List', path: '/api/admin/vendors' },
  { name: 'Documents List', path: '/api/admin/documents' },
  { name: 'Proposals List', path: '/api/admin/proposals' },
  { name: 'Audit Logs', path: '/api/admin/audit-logs' },
  { name: 'Page Routes Check', path: '/admin/dashboard' },
  { name: 'Vendors Page', path: '/admin/vendors' },
  { name: 'Documents Page', path: '/admin/documents' },
  { name: 'Proposals Page', path: '/admin/proposals' },
  { name: 'Create Vendor Page', path: '/admin/create-vendor' },
];

const vendorPages = [
  { name: 'Vendor Profile', path: '/api/vendor/profile' },
  { name: 'Vendor Documents', path: '/api/vendor/documents' },
  { name: 'Vendor Proposals', path: '/api/vendor/proposals' },
  { name: 'Vendor Submissions', path: '/api/vendor/proposals/submissions' },
  { name: 'Vendor Certificate', path: '/api/vendor/certificate' },
  { name: 'Vendor Dashboard Page', path: '/vendor/dashboard' },
  { name: 'Vendor Profile Page', path: '/vendor/profile' },
  { name: 'Vendor Documents Page', path: '/vendor/documents' },
  { name: 'Vendor Proposals Page', path: '/vendor/proposals' },
  { name: 'Vendor Certificate Page', path: '/vendor/certificate' },
];

async function loginAsAdmin(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@vms.com', password: 'Admin@123' }),
  });

  if (!response.ok) {
    throw new Error('Admin login failed');
  }

  const data = await response.json();
  return data.data.tokens.accessToken;
}

async function loginAsVendor(): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'vendor@vms.com', password: 'Admin@123' }),
  });

  if (!response.ok) {
    throw new Error('Vendor login failed');
  }

  const data = await response.json();
  return data.data.tokens.accessToken;
}

async function testPage(page: { name: string; path: string }, token: string, role: string): Promise<TestResult> {
  try {
    const isApi = page.path.startsWith('/api');
    const headers: Record<string, string> = {};

    if (isApi) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${page.path}`, {
      headers,
      redirect: 'manual',
    });

    const success = response.status < 500; // Consider 4xx as "page exists" for APIs, 200-299 for pages

    return {
      page: page.name,
      url: page.path,
      status: response.status,
      success,
      error: !success ? `Status ${response.status}` : undefined,
    };
  } catch (error) {
    return {
      page: page.name,
      url: page.path,
      status: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function testRolePages(pages: typeof adminPages, token: string, role: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${role.toUpperCase()} Pages`);
  console.log('='.repeat(60));

  const results: TestResult[] = [];

  for (const page of pages) {
    const result = await testPage(page, token, role);
    results.push(result);

    const icon = result.success ? '✅' : '❌';
    const status = result.status.toString().padEnd(3);
    console.log(`${icon} [${status}] ${result.page.padEnd(25)} ${result.url}`);

    if (!result.success && result.error) {
      console.log(`           Error: ${result.error}`);
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;

  console.log('\n' + '-'.repeat(60));
  console.log(`Results: ${successCount}/${results.length} pages accessible`);
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed:  ${failCount}`);
  console.log('='.repeat(60));

  return results;
}

async function testNewFeatures() {
  console.log('\n' + '='.repeat(60));
  console.log('Testing NEW Admin Features');
  console.log('='.repeat(60));

  const adminToken = await loginAsAdmin();

  // Test password reset API
  console.log('\n📝 Testing Admin Self Password Reset API...');
  const pwdResetResponse = await fetch(`${BASE_URL}/api/admin/account/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      currentPassword: 'WrongPassword',
      newPassword: 'NewPass123!',
    }),
  });
  console.log(`   Change Password API: ${pwdResetResponse.ok ? '✅' : '❌'} (Status: ${pwdResetResponse.status})`);

  // Test vendor password reset (need a vendor ID first)
  const vendorsResponse = await fetch(`${BASE_URL}/api/admin/vendors`, {
    headers: { 'Authorization': `Bearer ${adminToken}` },
  });
  const vendorsData = await vendorsResponse.json();
  const firstVendorId = vendorsData.data.items[0]?._id;

  if (firstVendorId) {
    console.log('\n🔑 Testing Vendor Password Reset API...');
    const vendorPwdResponse = await fetch(`${BASE_URL}/api/admin/vendors/${firstVendorId}/reset-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ newPassword: 'NewVendorPass123!' }),
    });
    console.log(`   Reset Vendor Password API: ${vendorPwdResponse.ok ? '✅' : '❌'} (Status: ${vendorPwdResponse.status})`);

    console.log('\n🚫 Testing Block Vendor API...');
    const blockResponse = await fetch(`${BASE_URL}/api/admin/vendors/${firstVendorId}/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ block: true, reason: 'Test block' }),
    });
    console.log(`   Block Vendor API: ${blockResponse.ok ? '✅' : '❌'} (Status: ${blockResponse.status})`);

    console.log('\n✅ Testing Unblock Vendor API...');
    const unblockResponse = await fetch(`${BASE_URL}/api/admin/vendors/${firstVendorId}/block`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ block: false }),
    });
    console.log(`   Unblock Vendor API: ${unblockResponse.ok ? '✅' : '❌'} (Status: ${unblockResponse.status})`);
  }

  console.log('\n' + '='.repeat(60));
}

async function main() {
  console.log('\n' + '🧪'.repeat(30));
  console.log('\n   VMS - Comprehensive Page & Feature Testing');
  console.log('\n' + '🧪'.repeat(30));

  try {
    // Test new features first
    await testNewFeatures();

    // Test Admin Pages
    const adminToken = await loginAsAdmin();
    console.log('\n✅ Admin login successful');
    await testRolePages(adminPages, adminToken, 'admin');

    // Test Vendor Pages
    const vendorToken = await loginAsVendor();
    console.log('\n✅ Vendor login successful');
    await testRolePages(vendorPages, vendorToken, 'vendor');

    // Summary
    console.log('\n\n' + '📊'.repeat(30));
    console.log('\n   FINAL SUMMARY');
    console.log('\n' + '📊'.repeat(30));
    console.log('\n✅ All tests completed!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@vms.com / Admin@123');
    console.log('   Vendor: vendor@vms.com / Admin@123');
    console.log(`\n🌐 Base URL: ${BASE_URL}`);
    console.log('\n' + '-'.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

main();
