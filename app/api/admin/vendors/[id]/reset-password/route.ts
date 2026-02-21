import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { ZodError } from 'zod';
import { z } from 'zod';

// Validation schema for password reset
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

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
    const validatedData = resetPasswordSchema.parse(body);

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

    // Reset password
    vendorUser.set('password', validatedData.newPassword);
    vendorUser.loginAttempts = 0;
    vendorUser.lockUntil = undefined;
    await vendorUser.save();

    // Log the activity
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.userId,
      activityType: 'PROFILE_UPDATED',
      description: 'Password reset by admin',
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Vendor password reset successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset vendor password error:', error);

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
          errors,
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
