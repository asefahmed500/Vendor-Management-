import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { scrypt } from 'crypto';
import { promisify } from 'util';

// Load environment variables first
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@vms.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  // Better Auth uses scrypt with specific parameters
  const salt = crypto.randomBytes(16).toString('base64');
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer;
  return `${salt}:${derivedKey.toString('base64')}`;
}

async function createBetterAuthAdmin() {
  try {
    console.log('🔧 Creating admin user with scrypt hash...');

    // Hash password using scrypt (Better Auth compatible)
    const passwordHash = await hashPassword(ADMIN_PASSWORD);

    console.log('Password hashed with scrypt');
    console.log('Hash:', passwordHash.substring(0, 30) + '...');

    // Create user in MongoDB with the correct hash
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db();

    // Check if user exists
    const existingUser = await db.collection('user').findOne({ email: ADMIN_EMAIL });

    if (existingUser) {
      console.log('🔄 Updating existing admin user password...');
      await db.collection('user').updateOne(
        { email: ADMIN_EMAIL },
        {
          $set: {
            password: passwordHash,
            role: 'ADMIN',
            name: 'Admin User',
            isActive: true,
          }
        }
      );
      console.log('✅ Admin user password updated');
    } else {
      console.log('📝 Creating new admin user...');
      await db.collection('user').insertOne({
        email: ADMIN_EMAIL,
        password: passwordHash,
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Admin user created');
    }

    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role: ADMIN`);

    await client.close();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createBetterAuthAdmin();
