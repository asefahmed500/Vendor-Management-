import { INotification, NotificationType } from '@/lib/db/models/Notification';
import {
  createNotification,
  createBulkNotifications,
  getUnreadNotifications,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadCount,
  notifyDocumentVerified,
  notifyProposalUpdate,
  notifyVendorStatusChanged,
} from '@/lib/notifications/service';

// Mock the Notification model
jest.mock('@/lib/db/models/Notification');

// Import the mocked module
import Notification from '@/lib/db/models/Notification';

// Define mock function types
const mockCreate = jest.fn();
const mockInsertMany = jest.fn();
const mockFind = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockFindOneAndDelete = jest.fn();
const mockUpdateMany = jest.fn();
const mockCountDocuments = jest.fn();

// Setup the mock
(Notification as any).create = mockCreate;
(Notification as any).insertMany = mockInsertMany;
(Notification as any).find = mockFind;
(Notification as any).findOneAndUpdate = mockFindOneAndUpdate;
(Notification as any).findOneAndDelete = mockFindOneAndDelete;
(Notification as any).updateMany = mockUpdateMany;
(Notification as any).countDocuments = mockCountDocuments;

describe('Notification Service', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockNotificationId = '507f1f77bcf86cd799439012';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'DOCUMENT_VERIFIED' as NotificationType,
        title: 'Test Notification',
        message: 'Test message',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      const input = {
        userId: mockUserId,
        type: 'DOCUMENT_VERIFIED' as NotificationType,
        title: 'Test Notification',
        message: 'Test message',
      };

      const result = await createNotification(input);

      expect(mockCreate).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockNotification);
    });

    it('should create notification with link and metadata', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'PROPOSAL_UPDATE' as NotificationType,
        title: 'Proposal Update',
        message: 'Your proposal status has changed',
        link: '/vendor/proposals',
        metadata: { proposalId: '123' },
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      const input = {
        userId: mockUserId,
        type: 'PROPOSAL_UPDATE' as NotificationType,
        title: 'Proposal Update',
        message: 'Your proposal status has changed',
        link: '/vendor/proposals',
        metadata: { proposalId: '123' },
      };

      const result = await createNotification(input);

      expect(mockCreate).toHaveBeenCalledWith(input);
      expect(result.link).toBe('/vendor/proposals');
      expect(result.metadata).toEqual({ proposalId: '123' });
    });
  });

  describe('createBulkNotifications', () => {
    it('should create multiple notifications', async () => {
      const mockNotifications = [
        {
          _id: '507f1f77bcf86cd799439012',
          userId: mockUserId,
          type: 'DOCUMENT_VERIFIED' as NotificationType,
          title: 'Doc 1',
          message: 'Document 1 verified',
          read: false,
          toObject: jest.fn().mockReturnValue({ _id: '507f1f77bcf86cd799439012', userId: mockUserId }),
        },
        {
          _id: '507f1f77bcf86cd799439013',
          userId: mockUserId,
          type: 'DOCUMENT_VERIFIED' as NotificationType,
          title: 'Doc 2',
          message: 'Document 2 verified',
          read: false,
          toObject: jest.fn().mockReturnValue({ _id: '507f1f77bcf86cd799439013', userId: mockUserId }),
        },
      ];

      mockInsertMany.mockResolvedValue(mockNotifications);

      const inputs = [
        {
          userId: mockUserId,
          type: 'DOCUMENT_VERIFIED' as NotificationType,
          title: 'Doc 1',
          message: 'Document 1 verified',
        },
        {
          userId: mockUserId,
          type: 'DOCUMENT_VERIFIED' as NotificationType,
          title: 'Doc 2',
          message: 'Document 2 verified',
        },
      ];

      const result = await createBulkNotifications(inputs);

      expect(mockInsertMany).toHaveBeenCalledWith(inputs);
      expect(result).toHaveLength(2);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should get unread notifications with default limit', async () => {
      const mockNotifications = [
        { _id: '1', userId: mockUserId, type: 'MESSAGE', title: 'Test', message: 'Test', read: false },
        { _id: '2', userId: mockUserId, type: 'MESSAGE', title: 'Test', message: 'Test', read: false },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockNotifications),
      };

      mockFind.mockReturnValue(mockQuery as any);

      const result = await getUnreadNotifications(mockUserId);

      expect(mockFind).toHaveBeenCalledWith({ userId: mockUserId, read: false });
      expect(mockQuery.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toHaveLength(2);
    });

    it('should respect custom limit', async () => {
      const mockNotifications = [{ _id: '1', userId: mockUserId, read: false }];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockNotifications),
      };

      mockFind.mockReturnValue(mockQuery as any);

      await getUnreadNotifications(mockUserId, 5);

      expect(mockFind).toHaveBeenCalledWith({ userId: mockUserId, read: false });
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });
  });

  describe('getUserNotifications', () => {
    it('should get paginated notifications', async () => {
      const mockNotifications = [
        { _id: '1', userId: mockUserId, read: false },
        { _id: '2', userId: mockUserId, read: true },
      ];

      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockNotifications),
      };

      mockFind.mockReturnValue(mockQuery as any);

      mockCountDocuments
        .mockResolvedValueOnce(2) // total count
        .mockResolvedValueOnce(1); // unread count

      const result = await getUserNotifications(mockUserId, { page: 1, pageSize: 20 });

      expect(result.notifications).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.unreadCount).toBe(1);
    });

    it('should filter unread only when requested', async () => {
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      };

      mockFind.mockReturnValue(mockQuery as any);

      mockCountDocuments
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      await getUserNotifications(mockUserId, { unreadOnly: true });

      expect(mockFind).toHaveBeenCalledWith({ userId: mockUserId, read: false });
    });
  });

  describe('markNotificationAsRead', () => {
    it('should mark notification as read', async () => {
      const mockNotification = { _id: mockNotificationId, userId: mockUserId, read: false };
      mockFindOneAndUpdate.mockResolvedValue(mockNotification);

      const result = await markNotificationAsRead(mockNotificationId, mockUserId);

      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockNotificationId, userId: mockUserId },
        { read: true }
      );
      expect(result).toBe(true);
    });

    it('should return false when notification not found', async () => {
      mockFindOneAndUpdate.mockResolvedValue(null);

      const result = await markNotificationAsRead(mockNotificationId, mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('markAllNotificationsAsRead', () => {
    it('should mark all notifications as read', async () => {
      mockUpdateMany.mockResolvedValue({ modifiedCount: 5 });

      const result = await markAllNotificationsAsRead(mockUserId);

      expect(mockUpdateMany).toHaveBeenCalledWith(
        { userId: mockUserId, read: false },
        { read: true }
      );
      expect(result).toBe(5);
    });

    it('should return 0 when no notifications to update', async () => {
      mockUpdateMany.mockResolvedValue({ modifiedCount: 0 });

      const result = await markAllNotificationsAsRead(mockUserId);

      expect(result).toBe(0);
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification', async () => {
      const mockNotification = { _id: mockNotificationId, userId: mockUserId };
      mockFindOneAndDelete.mockResolvedValue(mockNotification);

      const result = await deleteNotification(mockNotificationId, mockUserId);

      expect(mockFindOneAndDelete).toHaveBeenCalledWith({
        _id: mockNotificationId,
        userId: mockUserId,
      });
      expect(result).toBe(true);
    });

    it('should return false when notification not found', async () => {
      mockFindOneAndDelete.mockResolvedValue(null);

      const result = await deleteNotification(mockNotificationId, mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      mockCountDocuments.mockResolvedValue(3);

      const result = await getUnreadCount(mockUserId);

      expect(mockCountDocuments).toHaveBeenCalledWith({ userId: mockUserId, read: false });
      expect(result).toBe(3);
    });
  });

  describe('Helper Functions', () => {
    it('notifyDocumentVerified should create verified notification', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'DOCUMENT_VERIFIED',
        title: 'Document Verified',
        message: 'Your document "tax_doc.pdf" has been verified.',
        link: '/vendor/documents',
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      const result = await notifyDocumentVerified(mockUserId, 'tax_doc.pdf', true);

      expect(mockCreate).toHaveBeenCalledWith({
        userId: mockUserId,
        type: 'DOCUMENT_VERIFIED',
        title: 'Document Verified',
        message: 'Your document "tax_doc.pdf" has been verified.',
        link: '/vendor/documents',
        metadata: { documentName: 'tax_doc.pdf', verified: true, comments: undefined },
      });
      expect(result.type).toBe('DOCUMENT_VERIFIED');
    });

    it('notifyDocumentVerified should create rejected notification with comments', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'DOCUMENT_REJECTED',
        title: 'Document Revision Required',
        message: 'Your document "tax_doc.pdf" requires revision. Please provide clearer copy.',
        link: '/vendor/documents',
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      const result = await notifyDocumentVerified(mockUserId, 'tax_doc.pdf', false, 'Please provide clearer copy.');

      expect(mockCreate).toHaveBeenCalledWith({
        userId: mockUserId,
        type: 'DOCUMENT_REJECTED',
        title: 'Document Revision Required',
        message: 'Your document "tax_doc.pdf" requires revision. Please provide clearer copy.',
        link: '/vendor/documents',
        metadata: { documentName: 'tax_doc.pdf', verified: false, comments: 'Please provide clearer copy.' },
      });
      expect(result.type).toBe('DOCUMENT_REJECTED');
    });

    it('notifyProposalUpdate should create proposal notification', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'PROPOSAL_UPDATE',
        title: 'Proposal Status Update',
        message: 'Your proposal for "Website Redesign" is now UNDER_REVIEW.',
        link: '/vendor/proposals/submissions',
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      const result = await notifyProposalUpdate(mockUserId, 'Website Redesign', 'UNDER_REVIEW');

      expect(mockCreate).toHaveBeenCalledWith({
        userId: mockUserId,
        type: 'PROPOSAL_UPDATE',
        title: 'Proposal Status Update',
        message: 'Your proposal for "Website Redesign" is now UNDER_REVIEW.',
        link: '/vendor/proposals/submissions',
        metadata: { proposalTitle: 'Website Redesign', status: 'UNDER_REVIEW' },
      });
    });

    it('notifyVendorStatusChanged should create status notification', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'STATUS_CHANGED',
        title: 'Vendor Status Updated',
        message: 'Your vendor status has been updated to APPROVED.',
        link: '/vendor/dashboard',
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      const result = await notifyVendorStatusChanged(mockUserId, 'APPROVED');

      expect(mockCreate).toHaveBeenCalledWith({
        userId: mockUserId,
        type: 'STATUS_CHANGED',
        title: 'Vendor Status Updated',
        message: 'Your vendor status has been updated to APPROVED.',
        link: '/vendor/dashboard',
        metadata: { status: 'APPROVED' },
      });
    });

    it('notifyVendorStatusChanged should use custom message', async () => {
      const mockNotification = {
        _id: mockNotificationId,
        userId: mockUserId,
        type: 'STATUS_CHANGED',
        title: 'Vendor Status Updated',
        message: 'Custom status message here',
        link: '/vendor/dashboard',
      };

      mockCreate.mockResolvedValue({
        toObject: jest.fn().mockReturnValue(mockNotification),
      });

      await notifyVendorStatusChanged(mockUserId, 'APPROVED', 'Custom status message here');

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Custom status message here',
        })
      );
    });
  });
});
