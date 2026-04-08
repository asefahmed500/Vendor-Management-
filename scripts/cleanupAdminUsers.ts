import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';

async function cleanupAdminUsers() {
  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    // List all admin users
    const adminUsers = await db.collection('user').find({
      $or: [
        { email: { $regex: 'admin' } },
        { role: 'ADMIN' }
      ]
    }).toArray();

    console.log('Found admin users:');
    adminUsers.forEach((u: any) => {
      console.log(`  - ${u.email} (${u.role})`);
    });

    // Delete all admin users
    const deleteResult = await db.collection('user').deleteMany({
      $or: [
        { email: { $regex: 'admin' } },
        { role: 'ADMIN' }
      ]
    });

    console.log(`\n✅ Deleted ${deleteResult.deletedCount} admin user(s)`);

    // Create fresh admin via sign-up
    console.log('\n📝 Please create admin via sign-up endpoint:');
    console.log(`curl -X POST http://localhost:3003/api/auth/sign-up/email \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"email":"${ADMIN_EMAIL}","password":"Admin@123","name":"Admin User"}'`);

    await client.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupAdminUsers();
