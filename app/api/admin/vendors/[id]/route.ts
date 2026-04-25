import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IVendor } from '@/lib/types/vendor';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';
import { updateVendorSchema } from '@/lib/validation/schemas/vendor';
import { safeVendorAdminUpdate } from '@/lib/utils/update';
import { serialize } from '@/lib/utils/serialization';

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
      throw new NotFoundError('Vendor not found in registry');
    }

    return NextResponse.json<ApiResponse<{ vendor: IVendor }>>(
      {
        success: true,
        data: { vendor: serialize(vendor) as unknown as IVendor },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorById');
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

    const vendor = await Vendor.findById(id).populate('userId');

    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    const oldStatus = vendor.status;
    safeVendorAdminUpdate(vendor, validatedData);
    await vendor.save();

    // Trigger notifications and emails if status changed
    if (oldStatus !== vendor.status) {
      const { notifyVendorStatusChanged } = await import('@/lib/notifications/service');
      const { sendEmail, RegistrationApprovedEmail, RegistrationRejectedEmail } = await import('@/lib/email');
      
      await notifyVendorStatusChanged(
        vendor.userId._id.toString(),
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
          to: (vendor.userId as any).email || '',
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
          to: (vendor.userId as any).email || '',
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
        data: { vendor: serialize(vendor) as unknown as IVendor },
        message: 'Vendor record updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'UpdateVendor');
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
      throw new NotFoundError('Vendor not found');
    }

    await User.findByIdAndDelete(vendor.userId);
    await Vendor.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Vendor and associated credentials purged from registry',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'DeleteVendor');
  }
}

