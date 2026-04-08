import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

async function seedAdmin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Checking for admin user: ${ADMIN_EMAIL}`);

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      if (existingAdmin.role === 'ADMIN') {
        console.log('✅ Admin user already exists');
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Role: ${existingAdmin.role}`);
        console.log(`   Active: ${existingAdmin.isActive}`);
        await mongoose.disconnect();
        return;
      } else {
        console.log(`⚠️  User with email ${ADMIN_EMAIL} exists but is not an admin`);
        console.log(`   Current role: ${existingAdmin.role}`);
        console.log('   Please use a different admin email or update the user role manually');
        await mongoose.disconnect();
        process.exit(1);
      }
    }

    console.log('📝 Creating admin user...');

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const adminUser = new User({
      name: 'Admin User',
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      loginAttempts: 0,
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role: ADMIN`);
    console.log(`\n⚠️  IMPORTANT: Please change the default password after first login!`);

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

seedAdmin();
