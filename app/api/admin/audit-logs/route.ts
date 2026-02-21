import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';

interface AggregatedStats {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  activitiesByType: Record<string, number>;
  activitiesByUser: Array<{ userId: string; count: number; email?: string }>;
  recentActivities: Array<{
    _id: string;
    activityType: string;
    description: string;
    vendorId?: { companyName: string };
    performedBy: string;
    createdAt: Date;
  }>;
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

    const todayActivities = allActivities.filter((a) => new Date(a.createdAt) >= todayStart);
    const weekActivities = allActivities.filter((a) => new Date(a.createdAt) >= weekStart);
    const monthActivities = allActivities.filter((a) => new Date(a.createdAt) >= monthStart);

    const activitiesByType: Record<string, number> = {};
    allActivities.forEach((activity) => {
      const type = activity.activityType;
      activitiesByType[type] = (activitiesByType[type] || 0) + 1;
    });

    const activitiesByUser: Array<{ userId: string; count: number; email?: string }> = [];
    const userCounts = new Map<string, number>();
    allActivities.forEach((activity) => {
      const userId = (activity as any).performedBy?._id?.toString() || 'system';
      userCounts.set(userId, (userCounts.get(userId) || 0) + 1);
    });

    userCounts.forEach((count, userId) => {
      const activity = allActivities.find((a) => (a as any).performedBy?._id?.toString() === userId);
      activitiesByUser.push({
        userId,
        count,
        email: (activity as any)?.performedBy?.email,
      });
    });

    activitiesByUser.sort((a, b) => b.count - a.count);

    const recentActivities = allActivities.slice(0, 50).map((activity) => ({
      _id: (activity as any)._id?.toString(),
      activityType: activity.activityType,
      description: activity.description,
      vendorId: (activity as any).vendorId ? { companyName: (activity as any).vendorId.companyName } : undefined,
      performedBy: (activity as any).performedBy?.email || 'System',
      createdAt: activity.createdAt,
    }));

    return NextResponse.json<ApiResponse<AggregatedStats>>(
      {
        success: true,
        data: {
          totalActivities: allActivities.length,
          todayActivities: todayActivities.length,
          weekActivities: weekActivities.length,
          monthActivities: monthActivities.length,
          activitiesByType,
          activitiesByUser,
          recentActivities,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get audit logs error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
