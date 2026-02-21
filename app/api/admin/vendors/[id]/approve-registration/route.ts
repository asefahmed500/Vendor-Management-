import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { sendEmail, RegistrationApprovedEmail } from '@/lib/email';

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

    await connectDB();

    const vendor = await Vendor.findById(id).populate('userId');

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

    vendor.status = 'APPROVED_LOGIN';
    await vendor.save();

    // Log activity
    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.userId,
      activityType: 'REGISTRATION_APPROVED',
      description: 'Vendor registration approved',
      metadata: { comments: body.comments },
    });

    // Send approval email to vendor
    const vendorUser = await User.findById(vendor.userId);
    if (vendorUser && vendorUser.email) {
      const emailContent = RegistrationApprovedEmail({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
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
        message: 'Vendor registration approved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Approve registration error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
