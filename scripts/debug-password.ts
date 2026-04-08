import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

async function debugPassword() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vms');

  const admin = await User.findOne({ email: 'admin@vms.com' }).select('+password');

  if (!admin) {
    console.log('Admin user NOT FOUND');
  } else {
    console.log('Testing password comparison:');
    console.log('  Input password: Admin@123');

    const storedPassword = admin.password;
    if (!storedPassword) {
      console.log('  No password stored!');
    } else {
      // Test using User model's comparePassword method
      const result1 = await admin.comparePassword('Admin@123');
      console.log('  comparePassword method:', result1);

      // Test using bcrypt directly
      const result2 = await bcrypt.compare('Admin@123', storedPassword);
      console.log('  bcrypt.compare direct:', result2);

      // Hash a new password to see the format
      const newHash = await bcrypt.hash('Admin@123', 12);
      console.log('  New hash length:', newHash.length);
      console.log('  Stored hash length:', storedPassword.length);

      // Compare new hash with stored password
      const result4 = await bcrypt.compare('Admin@123', newHash);
      console.log('  New hash compare:', result4);
    }
  }

  await mongoose.disconnect();
}

debugPassword().catch(console.error);