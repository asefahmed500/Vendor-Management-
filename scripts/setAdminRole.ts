import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';

async function setAdminRole() {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    // Update user to ADMIN role
    const result = await db.collection('user').updateOne(
      { email: ADMIN_EMAIL },
      { $set: { role: 'ADMIN' } }
    );

    if (result.matchedCount > 0) {
      console.log('✅ User updated to ADMIN role');
      console.log(`   Email: ${ADMIN_EMAIL}`);
      console.log(`   Password: Admin@123`);
    } else {
      console.log('❌ User not found');
    }

    await client.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setAdminRole();
