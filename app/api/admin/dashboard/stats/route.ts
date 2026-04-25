import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IVendorStats } from '@/lib/types/vendor';
import { getAdminDashboardStats } from '@/lib/services/dashboard';
import { handleApiError } from '@/lib/middleware/errorHandler';

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

    const data = await getAdminDashboardStats();

    return NextResponse.json<ApiResponse<{
      stats: IVendorStats;
      pendingDocuments: number;
      proposalStats: {
        total: number;
        open: number;
        closed: number;
        awarded: number;
        submissions: number;
      }
    }>>(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetDashboardStats');
  }
}

