import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vms';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = 'Admin@123';

async function rawPasswordReset() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Finding admin user: ${ADMIN_EMAIL}`);

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    console.log(`🔐 Hashed password: ${hashedPassword.substring(0, 20)}...`);

    const result = await User.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
          loginAttempts: 0,
          lockUntil: null,
        }
      }
    );

    console.log(`Update result: ${result.modifiedCount} document(s) modified`);

    console.log('\n🧪 Testing password comparison...');
    const testAdmin = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

    if (!testAdmin) {
      console.log('❌ Cannot find admin to test password comparison');
      process.exit(1);
    }

    const isValid = await testAdmin.comparePassword(ADMIN_PASSWORD);
    console.log(`   Password comparison result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);

    if (isValid) {
      console.log('\n✅✅✅ ADMIN PASSWORD SUCCESSFULLY RESET! ✅✅✅');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      console.log(`   Role: ADMIN`);
      console.log(`   Active: true`);
    } else {
      console.log('\n❌ Password still invalid. This is a critical issue!');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

rawPasswordReset();
