import { NextRequest, NextResponse } from 'next/server';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { getVendorDashboardData } from '@/lib/services/dashboard';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await getVendorDashboardData(user.id);

    if (!data) {
      throw new NotFoundError('Vendor profile not found');
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorDashboard');
  }
}
