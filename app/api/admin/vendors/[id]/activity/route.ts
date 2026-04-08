import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import ActivityLog from '@/lib/db/models/ActivityLog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await adminGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    const logs = await ActivityLog.find({ vendorId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          activities: logs.map((log) => ({
            ...log,
            _id: log._id.toString(),
            vendorId: (log.vendorId as any).toString(),
            performedBy: (log.performedBy as any).toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorActivity');
  }
}
