import { NextRequest, NextResponse } from 'next/server';
import { authGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import {
  getUserNotifications,
  markAllNotificationsAsRead,
  getUnreadCount,
  deleteNotification,
} from '@/lib/notifications/service';
import Notification from '@/lib/db/models/Notification';

/**
 * GET /api/notifications
 * Get notifications for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await authGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const result = await getUserNotifications(user.id, {
      page,
      pageSize,
      unreadOnly,
    });

    return NextResponse.json<ApiResponse<typeof result>>(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetNotifications');
  }
}

/**
 * PUT /api/notifications
 * Mark all notifications as read
 */
export async function PUT(request: NextRequest) {
  try {
    const { authorized, user } = await authGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'markAllRead') {
      const count = await markAllNotificationsAsRead(user.id);

      return NextResponse.json<ApiResponse<{ count: number }>>(
        {
          success: true,
          data: { count },
          message: `${count} notifications marked as read`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    return handleApiError(error, 'UpdateNotifications');
  }
}

/**
 * DELETE /api/notifications
 * Delete all read notifications for the current user
 */
export async function DELETE(request: NextRequest) {
  try {
    const { authorized, user } = await authGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const result = await Notification.deleteMany({
      userId: user.id,
      read: true,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { deleted: result.deletedCount },
        message: `${result.deletedCount} read notifications cleared`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'DeleteNotifications');
  }
}
