import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IVendor } from '@/lib/types/vendor';
import { ZodError } from 'zod';
import { updateVendorSchema } from '@/lib/validation/schemas/vendor';
import { safeVendorAdminUpdate } from '@/lib/utils/update';

export async function GET(
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

    await connectDB();

    const vendor = await Vendor.findById(id).populate('userId', 'email isActive').lean();

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<{ vendor: IVendor }>>(
      {
        success: true,
        data: { vendor: vendor as unknown as IVendor },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get vendor error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const validatedData = updateVendorSchema.parse(body);

    await connectDB();

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    const oldStatus = vendor.status;
    safeVendorAdminUpdate(vendor, validatedData);
    await vendor.save();

    // Trigger notifications and emails if status changed
    if (oldStatus !== vendor.status) {
      const { notifyVendorStatusChanged } = await import('@/lib/notifications/service');
      const { sendEmail, RegistrationApprovedEmail, RegistrationRejectedEmail } = await import('@/lib/email');
      
      await notifyVendorStatusChanged(
        vendor.userId.toString(),
        vendor.status,
        vendor.status === 'REJECTED' ? vendor.rejectionReason : undefined
      );

      // Send email
      if (vendor.status === 'APPROVED') {
        const template = RegistrationApprovedEmail({
          contactPerson: vendor.contactPerson,
          companyName: vendor.companyName,
          loginUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/login`,
        });
        await sendEmail({
          to: (vendor as any).userId.email || '', // Assuming email is populated or available
          subject: template.subject,
          html: template.html,
        });
      } else if (vendor.status === 'REJECTED') {
        const template = RegistrationRejectedEmail({
          contactPerson: vendor.contactPerson,
          companyName: vendor.companyName,
          rejectionReason: vendor.rejectionReason || 'Does not meet current requirements',
        });
        await sendEmail({
          to: (vendor as any).userId.email || '',
          subject: template.subject,
          html: template.html,
        });
      }
    }

    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.id,
      activityType: 'PROFILE_UPDATED',
      description: `Vendor profile status updated to ${vendor.status}`,
    });

    return NextResponse.json<ApiResponse<{ vendor: IVendor }>>(
      {
        success: true,
        data: { vendor: vendor.toJSON() as unknown as IVendor },
        message: 'Vendor updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update vendor error:', error);

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

export async function DELETE(
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

    await connectDB();

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(vendor.userId);
    await Vendor.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Vendor deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete vendor error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
