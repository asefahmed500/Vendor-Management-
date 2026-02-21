import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connect';
import Document from '@/lib/db/models/Document';
import DocumentVerification from '@/lib/db/models/DocumentVerification';
import DocumentType from '@/lib/db/models/DocumentType';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { ZodError } from 'zod';
import { documentVerificationSchema } from '@/lib/validation/schemas/document';
import { sanitizeUserInput } from '@/lib/utils/sanitize';
import { sendEmail, DocumentVerifiedEmail } from '@/lib/email';

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

    const validatedData = documentVerificationSchema.parse(body);

    await connectDB();

    const document = await Document.findById(id);

    if (!document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    document.status = validatedData.status;
    await document.save();

    const existingVerification = await DocumentVerification.findOne({ documentId: id });

    if (existingVerification) {
      existingVerification.status = validatedData.status;
      existingVerification.comments = validatedData.comments;
      existingVerification.verifiedBy = new mongoose.Types.ObjectId(user.userId);
      existingVerification.verifiedAt = new Date();
      await existingVerification.save();
    } else {
      await DocumentVerification.create({
        documentId: id,
        verifiedBy: new mongoose.Types.ObjectId(user.userId),
        status: validatedData.status,
        comments: validatedData.comments,
      });
    }

    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: document.vendorId,
      performedBy: user.userId,
      activityType: validatedData.status === 'VERIFIED' ? 'DOCUMENT_VERIFIED' : 'DOCUMENT_REJECTED',
      description: `Document ${validatedData.status.toLowerCase()}`,
      metadata: {
        documentId: id,
        comments: validatedData.comments ? sanitizeUserInput(validatedData.comments) : undefined
      },
    });

    // Send verification email to vendor (only for verified documents)
    if (validatedData.status === 'VERIFIED') {
      const vendor = await Vendor.findById(document.vendorId);
      const documentType = await DocumentType.findById(document.documentTypeId);

      if (vendor) {
        const vendorUser = await User.findById(vendor.userId);
        if (vendorUser && vendorUser.email) {
          const emailContent = DocumentVerifiedEmail({
            companyName: vendor.companyName,
            contactPerson: vendor.contactPerson,
            documentName: documentType?.name || 'Document',
            verifiedAt: new Date().toISOString(),
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/documents`,
          });

          await sendEmail({
            to: vendorUser.email,
            subject: emailContent.subject,
            html: emailContent.html,
          });
        }
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: `Document ${validatedData.status.toLowerCase()} successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify document error:', error);

    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      // Filter out undefined values
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
