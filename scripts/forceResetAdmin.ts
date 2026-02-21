import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = 'Admin@123';

async function forceResetAdmin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Finding admin user: ${ADMIN_EMAIL}`);

    const admin = await User.findOne({ email: ADMIN_EMAIL });

    if (admin) {
      console.log('🔄 Found admin. Force resetting password...');

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      console.log(`🔐 Hashed password: ${hashedPassword.substring(0, 20)}...`);

      admin.password = hashedPassword;
      admin.role = 'ADMIN';
      admin.isActive = true;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;

      await admin.save();

      console.log('✅ Admin password reset successfully!');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Active: ${admin.isActive}`);
    } else {
      console.log('📝 Admin user not found. Creating new admin...');

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

      const adminUser = new User({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        loginAttempts: 0,
      });

      await adminUser.save();

      console.log('✅ Admin user created successfully!');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   Role: ADMIN`);
    }

    console.log('\n🧪 Testing password comparison...');
    const testAdmin = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

    if (!testAdmin) {
      console.log('❌ Cannot find admin to test password comparison');
      process.exit(1);
    }

    const isValid = await testAdmin.comparePassword(ADMIN_PASSWORD);
    console.log(`   Password comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

    if (!isValid) {
      console.log('\n❌ Password comparison failed. This is a critical issue!');
      console.log('   Re-hashing password and saving...');
      const newHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      testAdmin.password = newHash;
      await testAdmin.save();
      console.log('✅ Password re-hashed and saved');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

forceResetAdmin();
