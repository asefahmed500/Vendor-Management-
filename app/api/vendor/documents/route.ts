import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Document from '@/lib/db/models/Document';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import type { IDocument } from '@/lib/types/document';
import { ZodError } from 'zod';
import { submitDocumentsSchema } from '@/lib/validation/schemas/document';
import { uploadBuffer, validateFileType, deleteFile } from '@/lib/cloudinary/config';
import { sanitizeUserInput } from '@/lib/utils/sanitize';
import { sendEmail, DocumentsConfirmationEmail, DocumentsReceivedEmail, getAdminEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }


    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id });

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const documents = await Document.find({ vendorId: vendor._id })
      .populate('documentTypeId')
      .populate('verification')
      .lean();

    return NextResponse.json<ApiResponse<{ documents: IDocument[] }>>(
      {
        success: true,
        data: { documents: documents as any[] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get vendor documents error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }


    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id });

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentTypeId = formData.get('documentTypeId') as string;

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!documentTypeId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.name, file.type)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Invalid file type. Allowed types: PDF, JPG, PNG, DOCX',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
    if (file.size > maxSize) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadBuffer(buffer, file.name, {
      folder: `vms-documents/${vendor._id}`,
      resource_type: 'auto',
    });

    // Save document record to database
    const document = await Document.create({
      vendorId: vendor._id,
      documentTypeId,
      fileName: uploadResult.publicId,
      originalName: file.name,
      fileUrl: uploadResult.secureUrl,
      filePath: uploadResult.publicId, // Store publicId for deletion
      fileSize: uploadResult.bytes,
      mimeType: file.type,
      uploadedBy: user.id,
    });

    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.id,
      activityType: 'DOCUMENT_UPLOADED',
      description: `Document "${sanitizeUserInput(file.name)}" uploaded to Cloudinary`,
      metadata: { documentId: document._id, publicId: uploadResult.publicId },
    });

    return NextResponse.json<ApiResponse<{ document: IDocument }>>(
      {
        success: true,
        data: { document: document.toJSON() as any },
        message: 'Document uploaded successfully to Cloudinary',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Document upload error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = submitDocumentsSchema.parse(body);

    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id });

    if (!vendor) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    if (vendor.status !== 'APPROVED_LOGIN') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Cannot submit documents in current status' },
        { status: 400 }
      );
    }

    vendor.status = 'DOCUMENTS_SUBMITTED';
    await vendor.save();

    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.id,
      activityType: 'DOCUMENTS_SUBMITTED',
      description: 'Documents submitted for review',
      metadata: { documentIds: validatedData.documentIds },
    });

    // Get document count
    const documentCount = await Document.countDocuments({ vendorId: vendor._id });

    // Send confirmation email to vendor
    const vendorUser = await User.findById(vendor.userId);
    if (vendorUser && vendorUser.email) {
      const vendorEmailContent = DocumentsConfirmationEmail({
        companyName: vendor.companyName,
        contactPerson: vendor.contactPerson,
        documentCount,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard`,
      });

      await sendEmail({
        to: vendorUser.email,
        subject: vendorEmailContent.subject,
        html: vendorEmailContent.html,
      });
    }

    // Send notification email to admin
    const adminEmail = await getAdminEmail();
    const adminEmailContent = DocumentsReceivedEmail({
      companyName: vendor.companyName,
      contactPerson: vendor.contactPerson,
      vendorEmail: vendorUser?.email || '',
      documentCount,
      vendorDashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/admin/vendors`,
    });

    await sendEmail({
      to: adminEmail,
      subject: adminEmailContent.subject,
      html: adminEmailContent.html,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Documents submitted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Submit documents error:', error);

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
