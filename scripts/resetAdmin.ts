import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = 'Admin@123';

async function resetAdmin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Looking for admin user: ${ADMIN_EMAIL}`);

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('🔄 Found existing admin user. Resetting password...');

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'ADMIN';
      existingAdmin.isActive = true;
      existingAdmin.loginAttempts = 0;
      existingAdmin.lockUntil = undefined;

      await existingAdmin.save();

      console.log('✅ Admin password reset successfully');
    } else {
      console.log('📝 Admin user not found. Creating new admin user...');

      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

      const adminUser = new User({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        loginAttempts: 0,
      });

      await adminUser.save();

      console.log('✅ Admin user created successfully');
    }

    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role: ADMIN`);

  } catch (error) {
    console.error('❌ Error resetting admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

resetAdmin();
