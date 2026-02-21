import { NextRequest } from 'next/server';
import { guard, adminGuard, vendorGuard, authGuard } from '@/lib/auth/guards';
import { auth } from '@/lib/auth/auth';

// Mock the auth module
jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

describe('Auth Guards', () => {
  let mockRequest: NextRequest;
  let mockUser: any;

  beforeEach(() => {
    // Create a mock NextRequest with headers
    mockRequest = {
      headers: new Headers(),
    } as unknown as NextRequest;

    mockUser = {
      id: '507f1f77bcf86cd799439011',
      role: 'ADMIN',
      email: 'admin@example.com',
      name: 'Admin User',
    };

    jest.clearAllMocks();
  });

  describe('guard', () => {
    it('should authorize user with valid role', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });

      const result = await guard(mockRequest, ['ADMIN']);

      expect(result.authorized).toBe(true);
      expect(result.error).toBeNull();
      expect(result.user).toEqual(mockUser);
    });

    it('should authorize user with multiple allowed roles', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });

      const result = await guard(mockRequest, ['ADMIN', 'VENDOR']);

      expect(result.authorized).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should not authorize user with wrong role', async () => {
      const vendorUser = { ...mockUser, role: 'VENDOR' };
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: vendorUser });

      const result = await guard(mockRequest, ['ADMIN']);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe('Forbidden');
      expect(result.user).toEqual(vendorUser);
    });

    it('should return unauthorized when no session exists', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue(null);

      const result = await guard(mockRequest, ['ADMIN']);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe('Unauthorized');
      expect(result.user).toBeNull();
    });
  });

  describe('adminGuard', () => {
    it('should authorize admin users', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });

      const result = await adminGuard(mockRequest);

      expect(result.authorized).toBe(true);
    });

    it('should not authorize vendor users', async () => {
      const vendorUser = { ...mockUser, role: 'VENDOR' };
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: vendorUser });

      const result = await adminGuard(mockRequest);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe('Forbidden');
    });
  });

  describe('vendorGuard', () => {
    it('should authorize vendor users', async () => {
      const vendorUser = { ...mockUser, role: 'VENDOR' };
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: vendorUser });

      const result = await vendorGuard(mockRequest);

      expect(result.authorized).toBe(true);
    });

    it('should not authorize admin users', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });

      const result = await vendorGuard(mockRequest);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe('Forbidden');
    });
  });

  describe('authGuard', () => {
    it('should authorize authenticated users regardless of role', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: mockUser });
      const adminResult = await authGuard(mockRequest);
      expect(adminResult.authorized).toBe(true);

      const vendorUser = { ...mockUser, role: 'VENDOR' };
      (auth.api.getSession as jest.Mock).mockResolvedValue({ user: vendorUser });
      const vendorResult = await authGuard(mockRequest);
      expect(vendorResult.authorized).toBe(true);
    });

    it('should not authorize unauthenticated users', async () => {
      (auth.api.getSession as jest.Mock).mockResolvedValue(null);

      const result = await authGuard(mockRequest);

      expect(result.authorized).toBe(false);
      expect(result.error).toBe('Unauthorized');
    });
  });
});
