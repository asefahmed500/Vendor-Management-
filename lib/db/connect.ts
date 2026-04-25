import mongoose from 'mongoose';
import { globalTransformPlugin } from './plugins/transform';

// Apply global plugin
mongoose.plugin(globalTransformPlugin);

const MONGODB_URI = process.env.MONGODB_URI || '';

const isBuilding = process.env.NEXT_PHASE === 'phase-production-build';

if (isBuilding && (!MONGODB_URI || MONGODB_URI.trim() === '')) {
  console.warn('⚠️ MONGODB_URI not set - skipping DB connection during build');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  
  if (!uri || uri.trim() === '' || uri === 'mongodb://localhost:27017/vms') {
    console.warn('⚠️ MONGODB_URI not configured - skipping DB connection');
    return null as unknown as typeof mongoose;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
