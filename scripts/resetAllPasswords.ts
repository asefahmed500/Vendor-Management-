import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

async function resetAllPasswords() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vms');

  const users = await User.find();

  console.log(`Found ${users.length} users to update...`);

  for (const user of users) {
    user.set('password', 'Admin@123'); // Will trigger pre-save hook
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    console.log(`✅ Reset password for: ${user.email} (${user.role})`);
  }

  // Verify passwords work
  console.log('\n🔍 Verifying passwords...');
  for (const user of users) {
    const testUser = await User.findById(user._id).select('+password');
    const isValid = await testUser!.comparePassword('Admin@123');
    console.log(`  ${user.email}: ${isValid ? 'OK' : 'FAILED'}`);
  }

  console.log('\n✅ All passwords reset successfully!');
  console.log('\n📋 Test credentials:');
  console.log('   Email: admin@vms.com | Password: Admin@123 | Role: ADMIN');
  console.log('   Email: vendor@vms.com | Password: Admin@123 | Role: VENDOR');
  console.log('   Email: testvendor1@vms.com | Password: Admin@123 | Role: VENDOR');
  console.log('   Email: testvendor2@vms.com | Password: Admin@123 | Role: VENDOR');

  await mongoose.disconnect();
}

resetAllPasswords().catch(console.error);
