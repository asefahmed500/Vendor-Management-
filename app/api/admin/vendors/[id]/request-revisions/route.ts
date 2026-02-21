import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import Document from '@/lib/db/models/Document';
import DocumentType from '@/lib/db/models/DocumentType';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { ZodError } from 'zod';
import { requestRevisionsSchema } from '@/lib/validation/schemas/vendor';
import { sendEmail, RevisionRequestedEmail } from '@/lib/email';

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

    const validatedData = requestRevisionsSchema.parse(body);

    await connectDB();

    const vendor = await Vendor.findById(id);

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (vendor.status !== 'UNDER_REVIEW' && vendor.status !== 'DOCUMENTS_SUBMITTED') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor must have submitted documents or be under review' },
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
      activityType: 'REVISION_REQUESTED',
      description: 'Document revisions requested',
      metadata: {
        documentIds: validatedData.documentIds,
        message: validatedData.message,
      },
    });

    // Get rejected documents with their types and reasons
    const rejectedDocuments = await Document.find({
      _id: { $in: validatedData.documentIds },
    }).populate('documentTypeId').populate('verification');

    const rejectedDocsList = rejectedDocuments.map((doc) => ({
      documentName: (doc.documentTypeId as any)?.name || 'Unknown Document',
      reason: (doc.verification as any)?.comments || validatedData.message || 'Please provide updated information',
    }));

    // Send revision requested email to vendor
    const vendorUser = await User.findById(vendor.userId);
    if (vendorUser && vendorUser.email && rejectedDocsList.length > 0) {
      const emailContent = RevisionRequestedEmail({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        rejectedDocuments: rejectedDocsList,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/documents`,
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
        message: 'Revision requested successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Request revisions error:', error);

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
