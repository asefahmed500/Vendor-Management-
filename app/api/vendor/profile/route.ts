import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IVendor } from '@/lib/types/vendor';
import { ZodError } from 'zod';
import { updateVendorSchema } from '@/lib/validation/schemas/vendor';
import { safeVendorSelfUpdate, safeVendorAdminUpdate } from '@/lib/utils/update';

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
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const userData = await User.findById(user.id).select('email');

    return NextResponse.json<ApiResponse<{ vendor: IVendor; email: string }>>(
      {
        success: true,
        data: {
          vendor: vendor as unknown as IVendor,
          email: userData?.email || '',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get vendor profile error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
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
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    safeVendorSelfUpdate(vendor, validatedData);
    await vendor.save();

    return NextResponse.json<ApiResponse<{ vendor: IVendor }>>(
      {
        success: true,
        data: { vendor: vendor.toJSON() as unknown as IVendor },
        message: 'Profile updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update vendor profile error:', error);

    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const errors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(fieldErrors)) {
        if (value) {
          errors[key] = value;
        }
      }
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Validation error',
          errors: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
