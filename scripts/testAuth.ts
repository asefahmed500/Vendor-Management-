import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '.env.local' });

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// Test token from login
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTk2Y2UwZDM2OGE0YjQ2YzM5MGNkOWEiLCJyb2xlIjoiQURNSU4iLCJlbWFpbCI6ImFkbWluQHZtcy5jb20iLCJpYXQiOjE3NzE1MDI3MDcsImV4cCI6MTc3MTUwMzYwN30.qpG7suNsHBDakhLwIFQOs1qVoNHyFNpZr-gh0-AQHbM';

console.log('🔐 Testing JWT Token Verification');
console.log('=====================================\n');

console.log('Access Secret:', ACCESS_SECRET.substring(0, 20) + '...');
console.log('Token:', TEST_TOKEN.substring(0, 50) + '...\n');

try {
  const decoded = jwt.verify(TEST_TOKEN, ACCESS_SECRET) as any;
  console.log('✅ Token verified successfully!');
  console.log('   userId:', decoded.userId);
  console.log('   role:', decoded.role);
  console.log('   email:', decoded.email);
  console.log('   iat:', new Date(decoded.iat * 1000).toISOString());
  console.log('   exp:', new Date(decoded.exp * 1000).toISOString());
  console.log('   Valid until:', new Date(decoded.exp * 1000).toISOString());
} catch (error: any) {
  console.error('❌ Token verification failed:', error.message);
  if (error.name === 'TokenExpiredError') {
    console.log('   Token expired at:', new Date(error.expiredAt).toISOString());
  }
}

console.log('\n📋 Generating new test token...');
const testPayload = {
  userId: '6996ce0d368a4b46c390cd9a',
  role: 'ADMIN',
  email: 'admin@vms.com',
};

const newToken = jwt.sign(testPayload, ACCESS_SECRET, { expiresIn: '15m' });
console.log('New Token:', newToken);

console.log('\n🔍 Verifying new token...');
const decoded2 = jwt.verify(newToken, ACCESS_SECRET) as any;
console.log('✅ New token verified!');
console.log('   userId:', decoded2.userId);
console.log('   role:', decoded2.role);
