import mongoose from 'mongoose';

/**
 * Global Mongoose plugin to ensure all ObjectIds are converted to strings
 * during JSON serialization. This ensures compliance with AGENTS.md rules.
 */
export function globalTransformPlugin(schema: mongoose.Schema) {
  const transform = (doc: any, ret: any) => {
    // Convert _id to string
    if (ret._id && typeof ret._id === 'object') {
      ret._id = ret._id.toString();
    }
    
    // Convert any other ObjectId fields to strings recursively
    Object.keys(ret).forEach((key) => {
      if (ret[key] && typeof ret[key] === 'object' && ret[key].constructor.name === 'ObjectId') {
        ret[key] = ret[key].toString();
      } else if (Array.isArray(ret[key])) {
        ret[key] = ret[key].map((item: any) => {
          if (item && typeof item === 'object' && item.constructor.name === 'ObjectId') {
            return item.toString();
          }
          return item;
        });
      }
    });

    // Remove version key
    delete ret.__v;
    
    return ret;
  };

  // Set default transform options
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform,
  });

  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform,
  });
}
