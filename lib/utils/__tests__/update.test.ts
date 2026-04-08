import {
  safeVendorSelfUpdate,
  safeVendorAdminUpdate,
  mergeVendorUpdates,
  validateAllowedFields,
  sanitizeUpdateData,
} from '@/lib/utils/update';
import { IVendorDocument } from '@/lib/db/models/Vendor';
import { UpdateVendorInput } from '@/lib/validation/schemas/vendor';

// Mock the Vendor model for typing
const createMockVendor = (): IVendorDocument => ({
  _id: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439012',
  companyName: 'Test Company Inc.',
  contactPerson: 'John Doe',
  phone: '+1234567890',
  email: 'test@company.com',
  address: {
    street: '123 Test St',
    city: 'Test City',
    state: 'TS',
    country: 'Test Country',
    postalCode: '12345',
  },
  status: 'PENDING',
  certificateNumber: 'VND-20240101-ABC123',
  registrationDate: new Date('2024-01-01'),
  businessRegistrationNumber: 'BR123456',
  taxId: 'TAX123456',
  documents: [],
  save: jest.fn(),
  toObject: jest.fn(),
} as unknown as IVendorDocument);

describe('Update Utilities', () => {
  describe('safeVendorSelfUpdate', () => {
    it('should update allowed fields', () => {
      const vendor = createMockVendor();
      const data: Partial<UpdateVendorInput> = {
        companyName: 'Updated Company',
        contactPerson: 'Jane Doe',
        phone: '+9876543210',
      };

      safeVendorSelfUpdate(vendor, data);

      expect(vendor.companyName).toBe('Updated Company');
      expect(vendor.contactPerson).toBe('Jane Doe');
      expect(vendor.phone).toBe('+9876543210');
    });

    it('should merge nested address object', () => {
      const vendor = createMockVendor();
      const data: Partial<UpdateVendorInput> = {
        address: {
          street: '456 New St',
          city: 'New City',
        },
      };

      safeVendorSelfUpdate(vendor, data);

      expect(vendor.address.street).toBe('456 New St');
      expect(vendor.address.city).toBe('New City');
      expect(vendor.address.state).toBe('TS'); // unchanged
      expect(vendor.address.country).toBe('Test Country'); // unchanged
    });

    it('should ignore protected fields', () => {
      const vendor = createMockVendor();
      const originalStatus = vendor.status;
      const originalCertNumber = vendor.certificateNumber;

      const data: Partial<UpdateVendorInput> = {
        status: 'APPROVED',
        certificateNumber: 'VND-NEW-123456',
        companyName: 'Updated Company',
      } as any;

      safeVendorSelfUpdate(vendor, data);

      expect(vendor.status).toBe(originalStatus); // unchanged
      expect(vendor.certificateNumber).toBe(originalCertNumber); // unchanged
      expect(vendor.companyName).toBe('Updated Company'); // changed
    });

    it('should not update if no allowed fields provided', () => {
      const vendor = createMockVendor();
      const originalCompany = vendor.companyName;

      const data: Partial<UpdateVendorInput> = {
        status: 'APPROVED',
      } as any;

      safeVendorSelfUpdate(vendor, data);

      expect(vendor.companyName).toBe(originalCompany);
    });

    it('should update companyType and taxId', () => {
      const vendor = createMockVendor();
      const data: Partial<UpdateVendorInput> = {
        companyType: 'LLC',
        taxId: 'NEW-TAX-123',
      };

      safeVendorSelfUpdate(vendor, data);

      expect(vendor.companyType).toBe('LLC');
      expect(vendor.taxId).toBe('NEW-TAX-123');
    });
  });

  describe('safeVendorAdminUpdate', () => {
    it('should update allowed fields for admins', () => {
      const vendor = createMockVendor();
      const data: Partial<UpdateVendorInput> = {
        companyName: 'Admin Updated Company',
        contactPerson: 'Admin User',
      };

      safeVendorAdminUpdate(vendor, data);

      expect(vendor.companyName).toBe('Admin Updated Company');
      expect(vendor.contactPerson).toBe('Admin User');
    });

    it('should merge nested address object for admins', () => {
      const vendor = createMockVendor();
      const data: Partial<UpdateVendorInput> = {
        address: {
          postalCode: '54321',
        },
      };

      safeVendorAdminUpdate(vendor, data);

      expect(vendor.address.postalCode).toBe('54321');
      expect(vendor.address.street).toBe('123 Test St'); // unchanged
    });

    it('should ignore system protected fields for admins', () => {
      const vendor = createMockVendor();
      const originalCertNumber = vendor.certificateNumber;
      const originalRegDate = vendor.registrationDate;

      const data: Partial<UpdateVendorInput> = {
        certificateNumber: 'VND-HACKED',
        registrationDate: new Date('2025-01-01'),
        companyName: 'Updated',
      } as any;

      safeVendorAdminUpdate(vendor, data);

      expect(vendor.certificateNumber).toBe(originalCertNumber);
      expect(vendor.registrationDate).toEqual(originalRegDate);
      expect(vendor.companyName).toBe('Updated');
    });
  });

  describe('mergeVendorUpdates', () => {
    it('should merge updates with existing data', () => {
      const existing = {
        name: 'John',
        age: 30,
        city: 'NYC',
      };

      const updates = {
        name: 'Jane',
        age: 31,
      };

      const result = mergeVendorUpdates(existing, updates);

      expect(result.name).toBe('Jane');
      expect(result.age).toBe(31);
      expect(result.city).toBeUndefined(); // not in updates
    });

    it('should recursively merge nested objects', () => {
      const existing = {
        user: {
          name: 'John',
          email: 'john@example.com',
        },
        settings: {
          theme: 'dark',
        },
      };

      const updates = {
        user: {
          email: 'jane@example.com',
        },
        settings: {
          notifications: true,
        },
      };

      const result = mergeVendorUpdates(existing, updates);

      expect(result.user).toEqual({
        name: 'John',
        email: 'jane@example.com',
      });
      expect(result.settings).toEqual({
        theme: 'dark',
        notifications: true,
      });
    });

    it('should filter out undefined values', () => {
      const existing = {
        name: 'John',
        age: 30,
      };

      const updates = {
        name: 'Jane',
        age: undefined,
      };

      const result = mergeVendorUpdates(existing, updates);

      expect(result.name).toBe('Jane');
      expect(result.age).toBeUndefined();
    });

    it('should handle empty updates', () => {
      const existing = {
        name: 'John',
        age: 30,
      };

      const result = mergeVendorUpdates(existing, {});

      expect(result).toEqual({});
    });

    it('should not merge arrays', () => {
      const existing = {
        tags: ['a', 'b'],
        name: 'John',
      };

      const updates = {
        tags: ['c', 'd'],
      };

      const result = mergeVendorUpdates(existing, updates);

      // Arrays should be replaced, not merged
      expect(result.tags).toEqual(['c', 'd']);
    });
  });

  describe('validateAllowedFields', () => {
    it('should not throw if all fields are allowed', () => {
      const data = {
        name: 'John',
        email: 'john@example.com',
      };

      const allowedFields = ['name', 'email', 'phone'];

      expect(() => {
        validateAllowedFields(data, allowedFields);
      }).not.toThrow();
    });

    it('should throw if protected fields are present', () => {
      const data = {
        name: 'John',
        role: 'ADMIN', // protected
      };

      const allowedFields = ['name', 'email'];

      expect(() => {
        validateAllowedFields(data, allowedFields);
      }).toThrow('Cannot modify protected fields: role');
    });

    it('should list all protected fields in error message', () => {
      const data = {
        name: 'John',
        status: 'ACTIVE',
        role: 'ADMIN',
      };

      const allowedFields = ['name', 'email'];

      expect(() => {
        validateAllowedFields(data, allowedFields);
      }).toThrow('Cannot modify protected fields: status, role');
    });

    it('should handle empty data', () => {
      expect(() => {
        validateAllowedFields({}, ['name', 'email']);
      }).not.toThrow();
    });
  });

  describe('sanitizeUpdateData', () => {
    it('should remove undefined values', () => {
      const data = {
        name: 'John',
        age: 30,
        city: undefined,
        country: null as string | null,
      };

      const result = sanitizeUpdateData(data);

      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
      expect(result.city).toBeUndefined();
      expect(result.country).toBeNull(); // null is kept
    });

    it('should keep defined values including empty string', () => {
      const data = {
        name: 'John',
        email: '',
        phone: '+1234567890',
      };

      const result = sanitizeUpdateData(data);

      expect(result.name).toBe('John');
      expect(result.email).toBe('');
      expect(result.phone).toBe('+1234567890');
    });

    it('should keep zero values', () => {
      const data = {
        count: 0,
        price: 0,
        name: 'Product',
      };

      const result = sanitizeUpdateData(data);

      expect(result.count).toBe(0);
      expect(result.price).toBe(0);
      expect(result.name).toBe('Product');
    });

    it('should keep false boolean values', () => {
      const data = {
        isActive: false,
        isDeleted: false,
      };

      const result = sanitizeUpdateData(data);

      expect(result.isActive).toBe(false);
      expect(result.isDeleted).toBe(false);
    });

    it('should handle empty object', () => {
      const result = sanitizeUpdateData({});

      expect(result).toEqual({});
    });

    it('should preserve nested objects', () => {
      const data = {
        name: 'John',
        address: {
          street: '123 Main St',
          city: undefined,
        },
      };

      const result = sanitizeUpdateData(data);

      expect(result.name).toBe('John');
      expect(result.address).toEqual({
        street: '123 Main St',
        city: undefined,
      });
    });
  });
});
