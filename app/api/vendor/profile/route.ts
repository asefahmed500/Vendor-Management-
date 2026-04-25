import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';
import { updateVendorSchema } from '@/lib/validation/schemas/vendor';
import { safeVendorSelfUpdate } from '@/lib/utils/update';
import { serialize } from '@/lib/utils/serialization';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id }).lean();

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found');
    }

    const userData = await User.findById(user.id).select('email').lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          vendor: serialize(vendor),
          email: userData?.email || '',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorProfile');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateVendorSchema.parse(body);

    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id });

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found');
    }

    safeVendorSelfUpdate(vendor, validatedData);
    await vendor.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { vendor: serialize(vendor) },
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'UpdateVendorProfile');
  }
}
