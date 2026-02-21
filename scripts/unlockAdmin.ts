import mongoose from 'mongoose';
import User from '../lib/db/models/User';

async function unlockAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vms');
    const admin = await User.findOne({ email: 'admin@vms.com' });
    if (admin) {
      admin.isActive = true;
      admin.loginAttempts = 0;
      admin.lockUntil = undefined;
      await admin.save();
      console.log('Admin account unlocked successfully');
    } else {
      console.log('Admin user not found');
    }
    await mongoose.disconnect();
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

unlockAdmin();
