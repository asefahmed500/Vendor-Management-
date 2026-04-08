import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { block = true, reason = '' } = body;

    await connectDB();

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const vendorUser = await User.findById(vendor.userId);

    if (!vendorUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor user not found' },
        { status: 404 }
      );
    }

    // Block or unblock the user
    if (block) {
      vendorUser.isActive = false;
      await ActivityLog.create({
        vendorId: vendor._id,
        performedBy: user.id,
        activityType: 'PROFILE_UPDATED',
        description: `Vendor blocked by admin. Reason: ${reason || 'No reason provided'}`,
      });
    } else {
      vendorUser.isActive = true;
      vendorUser.loginAttempts = 0;
      vendorUser.lockUntil = undefined;
      await ActivityLog.create({
        vendorId: vendor._id,
        performedBy: user.id,
        activityType: 'PROFILE_UPDATED',
        description: 'Vendor unblocked by admin',
      });
    }

    await vendorUser.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: block ? 'Vendor blocked successfully' : 'Vendor unblocked successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Block/unblock vendor error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
