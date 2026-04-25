/**
 * Standard serialization utility to ensure ObjectIds are converted to strings.
 * This is especially useful for results from .lean() which are POJOs.
 */
export function serialize<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => serialize(item)) as unknown as T;
  }

  if (typeof data === 'object') {
    const obj = { ...data } as any;

    // Handle Mongoose ObjectId
    if (obj.constructor && obj.constructor.name === 'ObjectId') {
      return obj.toString() as unknown as T;
    }

    // Handle generic objects
    Object.keys(obj).forEach((key) => {
      const val = obj[key];

      if (val && typeof val === 'object') {
        if (val.constructor && val.constructor.name === 'ObjectId') {
          obj[key] = val.toString();
        } else {
          obj[key] = serialize(val);
        }
      }

      // Rename _id to id for consistency if needed, but project uses _id
      // We'll keep _id as string per requirements
      if (key === '_id' && val && typeof val === 'object') {
        obj[key] = val.toString();
      }
    });

    return obj as T;
  }

  return data;
}
