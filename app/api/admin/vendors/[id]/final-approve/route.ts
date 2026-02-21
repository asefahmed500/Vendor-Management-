import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { sendEmail, FinalApprovalEmail } from '@/lib/email';
import { generateCertificatePDF } from '@/lib/services/certificate.service';
import { generateCertificateNumber } from '@/lib/utils/certificate';

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

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (vendor.status !== 'UNDER_REVIEW') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor must be under review before final approval' },
        { status: 400 }
      );
    }

    const certificateNumber = generateCertificateNumber();

    vendor.status = 'APPROVED';
    vendor.approvalDate = new Date();
    vendor.certificateNumber = certificateNumber;
    await vendor.save();

    // Log activity
    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.userId,
      activityType: 'FINAL_APPROVAL',
      description: 'Vendor received final approval',
      metadata: { certificateNumber, comments: body.comments },
    });

    // Generate certificate PDF
    const pdfBuffer = Buffer.from(await generateCertificatePDF(vendor.toJSON() as any).arrayBuffer());

    // Send final approval email with certificate attachment
    const vendorUser = await User.findById(vendor.userId);
    if (vendorUser && vendorUser.email) {
      const emailContent = FinalApprovalEmail({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        certificateNumber,
        approvalDate: vendor.approvalDate.toISOString(),
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/certificate`,
      });

      await sendEmail({
        to: vendorUser.email,
        subject: emailContent.subject,
        html: emailContent.html,
        attachments: [
          {
            filename: `certificate-${vendor.companyName.replace(/\s+/g, '-')}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    }

    return NextResponse.json<ApiResponse<{ certificateNumber: string }>>(
      {
        success: true,
        data: { certificateNumber },
        message: 'Vendor approved successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Final approval error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
