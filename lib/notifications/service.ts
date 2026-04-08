import mongoose from 'mongoose';
import Notification from '@/lib/db/models/Notification';
import { INotification, NotificationType } from '@/lib/db/models/Notification';

/**
 * Notification Service
 *
 * Handles creating and managing user notifications
 */

export interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new notification for a user
 */
export async function createNotification(input: CreateNotificationInput): Promise<INotification> {
  const notification = await Notification.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link,
    metadata: input.metadata,
  });

  return notification.toObject() as unknown as INotification;
}

/**
 * Create notifications for multiple users (bulk)
 */
export async function createBulkNotifications(
  inputs: CreateNotificationInput[]
): Promise<INotification[]> {
  const notifications = await Notification.insertMany(inputs);
  return notifications.map((n) => {
    const obj = n.toObject();
    return {
      ...obj,
      _id: (obj._id as mongoose.Types.ObjectId).toString(),
    } as INotification;
  });
}

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(userId: string, limit = 10): Promise<INotification[]> {
  const notifications = await Notification.find({ userId, read: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean().exec() as unknown as INotification[];

  return notifications as unknown as INotification[];
}

/**
 * Get all notifications for a user with pagination
 */
export async function getUserNotifications(
  userId: string,
  options: { page?: number; pageSize?: number; unreadOnly?: boolean } = {}
): Promise<{ notifications: INotification[]; total: number; unreadCount: number }> {
  const { page = 1, pageSize = 20, unreadOnly = false } = options;
  const skip = (page - 1) * pageSize;

  const query: { userId: string; read?: boolean } = { userId };
  if (unreadOnly) {
    query.read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean().exec() as unknown as INotification[],
    Notification.countDocuments(query),
    Notification.countDocuments({ userId, read: false }),
  ]);

  return {
    notifications: notifications as unknown as INotification[],
    total,
    unreadCount,
  };
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
  const result = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true }
  );

  return !!result;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<number> {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );

  return result.modifiedCount;
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, userId: string): Promise<boolean> {
  const result = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  return !!result;
}

/**
 * Get unread count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return await Notification.countDocuments({ userId, read: false });
}

/**
 * Helper: Create document verification notification
 */
export async function notifyDocumentVerified(
  userId: string,
  documentName: string,
  verified: boolean,
  comments?: string
): Promise<INotification> {
  return createNotification({
    userId,
    type: verified ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REJECTED',
    title: verified ? 'Document Verified' : 'Document Revision Required',
    message: verified
      ? `Your document "${documentName}" has been verified.`
      : `Your document "${documentName}" requires revision. ${comments || 'Please check the details.'}`,
    link: '/vendor/documents',
    metadata: { documentName, verified, comments },
  });
}

/**
 * Helper: Create proposal update notification
 */
export async function notifyProposalUpdate(
  userId: string,
  proposalTitle: string,
  status: string
): Promise<INotification> {
  return createNotification({
    userId,
    type: 'PROPOSAL_UPDATE',
    title: 'Proposal Status Update',
    message: `Your proposal for "${proposalTitle}" is now ${status}.`,
    link: '/vendor/proposals/submissions',
    metadata: { proposalTitle, status },
  });
}

/**
 * Helper: Create vendor status change notification
 */
export async function notifyVendorStatusChanged(
  userId: string,
  status: string,
  message?: string
): Promise<INotification> {
  return createNotification({
    userId,
    type: 'STATUS_CHANGED',
    title: 'Vendor Status Updated',
    message: message || `Your vendor status has been updated to ${status}.`,
    link: '/vendor/dashboard',
    metadata: { status },
  });
}
