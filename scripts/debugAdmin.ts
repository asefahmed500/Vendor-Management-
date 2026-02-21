import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = 'Admin@123';

async function debugAdmin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Looking for admin user: ${ADMIN_EMAIL}`);

    const user = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

    if (!user) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('\n📋 User Details:');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   isActive:', user.isActive);
    console.log('   loginAttempts:', user.loginAttempts);
    console.log('   lockUntil:', user.lockUntil);
    console.log('   isLocked:', (user as any).isLocked);

    console.log('\n🔐 Testing password...');
    const isMatch = await bcrypt.compare(ADMIN_PASSWORD, user.password);
    console.log('   Password match:', isMatch);

    console.log('\n🔐 Stored hash:', user.password.substring(0, 30) + '...');
    console.log('   Hash length:', user.password.length);

    // Test with comparePassword method
    console.log('\n🔐 Testing with comparePassword method...');
    const methodMatch = await user.comparePassword(ADMIN_PASSWORD);
    console.log('   Method result:', methodMatch);

    // Create new hash for comparison
    console.log('\n🔐 Creating new hash for comparison...');
    const newHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    console.log('   New hash:', newHash.substring(0, 30) + '...');
    const newMatch = await bcrypt.compare(ADMIN_PASSWORD, newHash);
    console.log('   New hash matches:', newMatch);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

debugAdmin();
