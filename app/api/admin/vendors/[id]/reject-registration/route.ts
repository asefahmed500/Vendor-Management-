import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { ZodError } from 'zod';
import { rejectRegistrationSchema } from '@/lib/validation/schemas/vendor';
import { sendEmail, RegistrationRejectedEmail } from '@/lib/email';

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

    const validatedData = rejectRegistrationSchema.parse(body);

    await connectDB();

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (vendor.status !== 'PENDING') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor registration is not in pending status' },
        { status: 400 }
      );
    }

    vendor.status = 'REJECTED';
    vendor.rejectionReason = validatedData.reason;
    await vendor.save();

    // Log activity
    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.id,
      activityType: 'REGISTRATION_REJECTED',
      description: 'Vendor registration rejected',
      metadata: { reason: validatedData.reason },
    });

    // Send rejection email to vendor
    const vendorUser = await User.findById(vendor.userId);
    if (vendorUser && vendorUser.email) {
      const emailContent = RegistrationRejectedEmail({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        rejectionReason: validatedData.reason,
      });

      await sendEmail({
        to: vendorUser.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Vendor registration rejected successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reject registration error:', error);

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
