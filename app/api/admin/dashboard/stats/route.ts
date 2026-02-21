import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import Document from '@/lib/db/models/Document';
import Proposal from '@/lib/db/models/Proposal';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IVendorStats } from '@/lib/types/vendor';
import { getAdminDashboardStats } from '@/lib/services/dashboard';

export async function GET(request: NextRequest) {
  try {
    const result = await adminGuard(request);
    const { authorized } = result;

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Unauthorized' },
        { status: 401 }
      );
    }

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
    console.error('Get dashboard stats error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
