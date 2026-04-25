import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import { serialize } from '@/lib/utils/serialization';

interface AggregatedStats {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByUser: Array<{ userId: string; count: number; email?: string }>;
  recentActivities: Array<unknown>;
}

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = request.nextUrl;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const activityType = searchParams.get('activityType');

    const query: Record<string, unknown> = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        (query.createdAt as Record<string, unknown>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.createdAt as Record<string, unknown>).$lte = new Date(endDate);
      }
    }

    if (activityType) {
      query.activityType = activityType;
    }

    // Use lean() for performance and manual serialization where needed
    const allActivities = await ActivityLog.find(query)
      .populate('vendorId', 'companyName')
      .populate('performedBy', 'email')
      .sort({ createdAt: -1 })
      .limit(1000)
      .lean();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activitiesByType: Record<string, number> = {};
    const userCounts = new Map<string, { count: number; email?: string }>();

    let todayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    allActivities.forEach((activity) => {
      const activityDate = new Date(activity.createdAt);
      
      // Time-based stats
      if (activityDate >= todayStart) todayCount++;
      if (activityDate >= weekStart) weekCount++;
      if (activityDate >= monthStart) monthCount++;

      // Type-based stats
      const type = activity.activityType;
      activitiesByType[type] = (activitiesByType[type] || 0) + 1;

      // User-based stats
      const userId = activity.performedBy?._id?.toString() || 'system';
      const existing = userCounts.get(userId) || { count: 0, email: activity.performedBy?.email };
      userCounts.set(userId, { count: existing.count + 1, email: existing.email });
    });

    const activitiesByUser = Array.from(userCounts.entries())
      .map(([userId, info]) => ({
        userId,
        count: info.count,
        email: info.email,
      }))
      .sort((a, b) => b.count - a.count);

    const recentActivities = allActivities.slice(0, 50).map((activity) => ({
      ...activity,
      _id: activity._id.toString(),
      performedBy: activity.performedBy?.email || 'System',
    }));

    return NextResponse.json<ApiResponse<AggregatedStats>>(
      {
        success: true,
        data: {
          totalActivities: allActivities.length,
          todayActivities: todayCount,
          weekActivities: weekCount,
          monthActivities: monthCount,
          activitiesByType,
          activitiesByUser,
          recentActivities: serialize(recentActivities),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetAuditLogs');
  }
}
