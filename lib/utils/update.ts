import { IVendorDocument } from '@/lib/db/models/Vendor';
import { UpdateVendorInput } from '@/lib/validation/schemas/vendor';

/**
 * Allowed fields for vendor self-update
 * Vendors can only update their basic company information
 */
const VENDOR_SELF_UPDATE_FIELDS: (keyof UpdateVendorInput)[] = [
  'companyName',
  'contactPerson',
  'phone',
  'address',
  'companyType',
  'taxId',
];

/**
 * Protected fields that only admins can modify
 */
const ADMIN_ONLY_FIELDS = [
  'status',
  'rejectionReason',
  'approvalDate',
  'certificateNumber',
  'registrationDate',
  'userId',
];

/**
 * Safely updates a vendor profile with self-update restrictions
 *
 * Vendors can only update specific fields (company info, contact details).
 * Protected fields like status, certificate, approval date are ignored.
 *
 * @param vendor - The vendor Mongoose document to update
 * @param data - Validated update data from updateVendorSchema
 */
export function safeVendorSelfUpdate(
  vendor: IVendorDocument,
  data: UpdateVendorInput
): void {
  for (const field of VENDOR_SELF_UPDATE_FIELDS) {
    if (data[field] !== undefined) {
      // Handle nested address object
      if (field === 'address' && data.address) {
        vendor.address = {
          ...vendor.address,
          ...data.address,
        };
      } else {
        // For direct fields, use type assertion to satisfy TypeScript
        (vendor as any)[field] = data[field];
      }
    }
  }
}

/**
 * Safely updates a vendor profile with admin privileges
 *
 * Admins can update all vendor fields except protected system fields.
 *
 * @param vendor - The vendor Mongoose document to update
 * @param data - Validated update data from updateVendorSchema
 */
export function safeVendorAdminUpdate(
  vendor: IVendorDocument,
  data: UpdateVendorInput
): void {
  // Combine allowed fields and admin-only fields for administrative updates
  const allFields = [...VENDOR_SELF_UPDATE_FIELDS, ...ADMIN_ONLY_FIELDS] as (keyof UpdateVendorInput)[];

  for (const field of allFields) {
    if (data[field] !== undefined) {
      // Handle nested address object
      if (field === 'address' && data.address) {
        vendor.address = {
          ...vendor.address,
          ...data.address,
        };
      } else {
        // For direct fields, use type assertion to satisfy TypeScript
        (vendor as any)[field] = data[field];
      }
    }
  }
}

/**
 * Merges partial update data with existing vendor data
 * Useful for handling partial updates from forms
 *
 * @param existing - Current vendor data
 * @param updates - Partial update data
 * @returns Merged data with undefined fields filtered out
 */
export function mergeVendorUpdates<T extends Record<string, any>>(
  existing: T,
  updates: Partial<T>
): Partial<T> {
  const merged: Partial<T> = {};

  for (const [key, value] of Object.entries(updates)) {
    // Only include fields that are defined in updates
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Recursively merge nested objects
        merged[key as keyof T] = {
          ...(existing[key as keyof T] as any),
          ...value,
        } as T[keyof T];
      } else {
        merged[key as keyof T] = value;
      }
    }
  }

  return merged;
}

/**
 * Validates that only allowed fields are being updated
 * Throws an error if a protected field is being modified
 *
 * @param data - Update data to validate
 * @param allowedFields - List of field names that are allowed to be updated
 * @throws Error if a protected field is being modified
 */
export function validateAllowedFields(
  data: Record<string, any>,
  allowedFields: string[]
): void {
  const providedFields = Object.keys(data);
  const protectedFields = providedFields.filter(
    field => !allowedFields.includes(field)
  );

  if (protectedFields.length > 0) {
    throw new Error(
      `Cannot modify protected fields: ${protectedFields.join(', ')}`
    );
  }
}

/**
 * Sanitizes update data by removing undefined values
 * This prevents accidentally setting fields to undefined
 *
 * @param data - Raw update data
 * @returns Sanitized data with undefined values removed
 */
export function sanitizeUpdateData<T extends Record<string, any>>(
  data: T
): Partial<T> {
  const sanitized: Partial<T> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      sanitized[key as keyof T] = value;
    }
  }

  return sanitized;
}
