import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = 'Admin@123';

async function forceSetAdmin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`\n🔍 Finding admin user: ${ADMIN_EMAIL}`);

    // Find and update in one operation
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    console.log('🔐 Generated new hash:', hashedPassword.substring(0, 30) + '...');

    // Verify hash works
    const verifyHash = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
    console.log('✅ Hash verification:', verifyHash);

    // Update or create user
    const user = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        loginAttempts: 0,
        lockUntil: undefined,
      },
      { upsert: true, new: true, setDefaultsOnSave: false }
    );

    console.log('\n✅ Admin user configured successfully!');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('   Role:', user.role);
    console.log('   isActive:', user.isActive);

    // Verify by comparing password directly from DB
    const dbUser = await User.findOne({ email: ADMIN_EMAIL }).select('+password');
    if (dbUser) {
      const finalCheck = await dbUser.comparePassword(ADMIN_PASSWORD);
      console.log('\n✅ Final password verification:', finalCheck);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Database connection closed');
  }
}

forceSetAdmin();
