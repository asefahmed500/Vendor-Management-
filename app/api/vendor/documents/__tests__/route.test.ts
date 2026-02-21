/**
 * Document API Unit Tests
 */

jest.mock('@/lib/auth/guards', () => ({
  __esModule: true,
  vendorGuard: jest.fn(),
  adminGuard: jest.fn(),
  authGuard: jest.fn(),
}));

jest.mock('@/lib/db/models/User', () => ({
  __esModule: true,
  default: {
    findById: jest.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439014', email: 'vendor@example.com' }),
    findOne: jest.fn().mockResolvedValue({ id: '507f1f77bcf86cd799439011', email: 'admin@vms.com' }),
  },
}));

jest.mock('@/lib/cloudinary/config', () => ({
  __esModule: true,
  uploadBuffer: jest.fn(),
  validateFileType: jest.fn(),
  deleteFile: jest.fn(),
}));

jest.mock('@/lib/db/models/Document', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    find: jest.fn(() => ({
      lean: jest.fn(),
    })),
    countDocuments: jest.fn().mockResolvedValue(10),
  },
}));

jest.mock('@/lib/db/models/DocumentType', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

jest.mock('@/lib/db/models/Vendor', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

jest.mock('@/lib/db/models/ActivityLog', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/db/connect', () => jest.fn());

jest.mock('@/lib/email', () => ({
  __esModule: true,
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
  DocumentsConfirmationEmail: jest.fn().mockReturnValue({ subject: 'Test', html: '<p>Test</p>' }),
  DocumentsReceivedEmail: jest.fn().mockReturnValue({ subject: 'Test', html: '<p>Test</p>' }),
  getAdminEmail: jest.fn().mockResolvedValue('admin@vms.com'),
}));

import { vendorGuard } from '@/lib/auth/guards';
import { validateFileType, uploadBuffer } from '@/lib/cloudinary/config';
import Vendor from '@/lib/db/models/Vendor';
import Document from '@/lib/db/models/Document';
import DocumentType from '@/lib/db/models/DocumentType';
import { POST, PUT } from '../route';

describe('POST /api/vendor/documents (Upload)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default behaviors
    (validateFileType as jest.Mock).mockReturnValue(true);
    (vendorGuard as jest.Mock).mockResolvedValue({ authorized: true, user: { id: '507f1f77bcf86cd799439014' } });
    (Vendor.findOne as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439012',
      userId: '507f1f77bcf86cd799439014',
      companyName: 'Test Vendor',
    });
  });

  it('should return 401 for unauthorized request', async () => {
    (vendorGuard as jest.Mock).mockResolvedValue({ authorized: false, user: null });

    const request = {
      formData: jest.fn(),
      url: 'http://localhost:3000/api/vendor/documents',
      method: 'POST',
      headers: new Headers(),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should return 400 for missing file', async () => {
    const mockFormData = {
      get: jest.fn((key: string) => {
        if (key === 'documentTypeId') return 'doc-type-1';
        return null;
      }),
    };

    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
      url: 'http://localhost:3000/api/vendor/documents',
      method: 'POST',
      headers: new Headers(),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('file');
  });

  it('should return 400 for missing document type', async () => {
    const mockFile = {
      name: 'test.pdf',
      type: 'application/pdf',
      size: 1024,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    };
    const mockFormData = {
      get: jest.fn((key: string) => {
        if (key === 'file') return mockFile;
        return null;
      }),
    };

    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
      url: 'http://localhost:3000/api/vendor/documents',
      method: 'POST',
      headers: new Headers(),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Document type');
  });

  it('should return 400 for file exceeding 10MB limit', async () => {
    const mockFile = {
      name: 'large.pdf',
      type: 'application/pdf',
      size: 11 * 1024 * 1024, // 11MB
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    };
    const mockFormData = {
      get: jest.fn((key: string) => {
        if (key === 'file') return mockFile;
        if (key === 'documentTypeId') return 'doc-type-1';
        return null;
      }),
    };

    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
      url: 'http://localhost:3000/api/vendor/documents',
      method: 'POST',
      headers: new Headers(),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('10MB');
  });

  it('should return 400 for invalid file type', async () => {
    (validateFileType as jest.Mock).mockReturnValue(false);

    const mockFile = {
      name: 'test.txt',
      type: 'text/plain',
      size: 1024,
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(0)),
    };
    const mockFormData = {
      get: jest.fn((key: string) => {
        if (key === 'file') return mockFile;
        if (key === 'documentTypeId') return 'doc-type-1';
        return null;
      }),
    };

    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
      url: 'http://localhost:3000/api/vendor/documents',
      method: 'POST',
      headers: new Headers(),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('file type');
  });

  it('should successfully upload valid document', async () => {
    (uploadBuffer as jest.Mock).mockResolvedValue({
      secureUrl: 'https://cloudinary.com/upload/test.pdf',
      publicId: 'test-public-id',
      bytes: 1024,
    });

    (DocumentType.findOne as jest.Mock).mockResolvedValue({
      _id: 'doctype-1',
      name: 'Business Registration',
    });

    (Document.create as jest.Mock).mockResolvedValue({
      _id: '507f1f77bcf86cd799439013',
      originalName: 'test.pdf',
      fileUrl: 'https://cloudinary.com/upload/test.pdf',
      cloudinaryPublicId: 'test-public-id',
      fileSize: 1024,
      toJSON: jest.fn().mockReturnThis(),
    });

    const mockFile = {
      name: 'test.pdf',
      type: 'application/pdf',
      size: 1024,
      arrayBuffer: jest.fn().mockResolvedValue(Buffer.from('test content').buffer),
    };
    const mockFormData = {
      get: jest.fn((key: string) => {
        if (key === 'file') return mockFile;
        if (key === 'documentTypeId') return 'doctype-1';
        return null;
      }),
    };

    const request = {
      formData: jest.fn().mockResolvedValue(mockFormData),
      url: 'http://localhost:3000/api/vendor/documents',
      method: 'POST',
      headers: new Headers(),
    } as any;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.document).toHaveProperty('originalName', 'test.pdf');
  });
});
