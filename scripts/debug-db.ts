import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

import User from '../lib/db/models/User';

async function debugDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vms');

  const admin = await User.findOne({ email: 'admin@vms.com' }).select('+password');

  if (!admin) {
    console.log('Admin user NOT FOUND in database');
  } else {
    console.log('Admin user found:');
    console.log('  Email:', admin.email);
    console.log('  Role:', admin.role);
    console.log('  Active:', admin.isActive);
    console.log('  Password hash:', admin.password ? 'YES' : 'NO');
    console.log('  Password hash length:', admin.password?.length || 0);
    console.log('  Login attempts:', admin.loginAttempts);
  }

  await mongoose.disconnect();
}

debugDB().catch(console.error);
