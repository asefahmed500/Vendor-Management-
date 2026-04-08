import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import User from '../lib/db/models/User';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = 'admin@vms.com';
const NEW_PASSWORD = 'Admin@123';

async function resetAdmin() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    
    console.log(`🔍 Finding user: ${ADMIN_EMAIL}`);
    const user = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!user) {
      console.log('❌ User not found. Creating new admin...');
      await User.create({
        name: 'Nexus Admin',
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD,
        role: 'ADMIN',
        isActive: true
      });
      console.log('✅ Admin created successfully');
    } else {
      console.log('✅ User found. Resetting password...');
      user.password = NEW_PASSWORD;
      await user.save();
      console.log('✅ Password reset successfully');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdmin();
