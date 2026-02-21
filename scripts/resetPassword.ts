import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

async function resetAdminPassword() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vms');

  // Get or create admin user
  let admin = await User.findOne({ email: 'admin@vms.com' });

  if (!admin) {
    admin = new User({
      email: 'admin@vms.com',
      password: 'Admin@123', // Will be hashed by pre-save hook
      role: 'ADMIN',
      isActive: true,
      loginAttempts: 0,
    });
    console.log('Creating new admin user...');
  } else {
    console.log('Updating existing admin user password...');
    admin.set('password', 'Admin@123'); // Will trigger pre-save hook
    admin.loginAttempts = 0;
    admin.lockUntil = undefined;
  }

  await admin.save();

  // Verify the password was set correctly
  admin = await User.findOne({ email: 'admin@vms.com' }).select('+password') as any;
  const isValid = await admin!.comparePassword('Admin@123');

  console.log('\nPassword verification result:', isValid ? 'SUCCESS' : 'FAILED');
  console.log('\nAdmin credentials:');
  console.log('  Email: admin@vms.com');
  console.log('  Password: Admin@123');
  console.log('  Role: ADMIN');

  await mongoose.disconnect();
}

resetAdminPassword().catch(console.error);
