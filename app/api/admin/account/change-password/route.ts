import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';
import { updatePasswordSchema } from '@/lib/validation/schemas/auth';

export async function PUT(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

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

    // Verify current password
    const isPasswordValid = await userData.comparePassword(validatedData.currentPassword);

    if (!isPasswordValid) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update password
    userData.set('password', validatedData.newPassword);
    userData.loginAttempts = 0;
    userData.lockUntil = undefined;
    await userData.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Password changed successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'ChangePassword');
  }
}
