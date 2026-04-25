import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';
import { updatePasswordSchema } from '@/lib/validation/schemas/auth';

export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updatePasswordSchema.parse(body);

    await connectDB();

    const userData = await User.findById(user.id).select('+password');
    
    if (!userData) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await userData.comparePassword(validatedData.currentPassword);
    if (!isMatch) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    userData.password = validatedData.newPassword;
    userData.mustChangePassword = false;
    userData.passwordChangedAt = new Date();
    await userData.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Password changed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'VendorChangePassword');
  }
}