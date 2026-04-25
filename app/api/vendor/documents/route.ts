import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Document from '@/lib/db/models/Document';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { submitDocumentsSchema } from '@/lib/validation/schemas/document';
import { uploadBuffer, validateFileType } from '@/lib/cloudinary/config';
import { sanitizeUserInput } from '@/lib/utils/sanitize';
import { sendEmail, DocumentsConfirmationEmail, DocumentsReceivedEmail, getAdminEmail } from '@/lib/email';
import { createBulkNotifications } from '@/lib/notifications/service';
import { handleApiError, NotFoundError, BadRequestError } from '@/lib/middleware/errorHandler';
import { serialize } from '@/lib/utils/serialization';

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
      throw new NotFoundError('Vendor profile not found');
    }

    const documents = await Document.find({ vendorId: vendor._id })
      .populate('documentTypeId')
      .populate('verification')
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { documents: serialize(documents) },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
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
      throw new NotFoundError('Vendor profile not found');
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentTypeId = formData.get('documentTypeId') as string;

    if (!file) {
      throw new BadRequestError('No file provided');
    }

    if (!documentTypeId) {
      throw new BadRequestError('Document type is required');
    }

    // Validate file type
    if (!validateFileType(file.name, file.type)) {
      throw new BadRequestError('Invalid file type. Allowed types: PDF, JPG, PNG, DOCX');
    }

    // Validate file size (10MB max)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
    if (file.size > maxSize) {
      throw new BadRequestError(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
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

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { document: serialize(document) },
        message: 'Document uploaded successfully to Cloudinary',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
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
      throw new NotFoundError('Vendor profile not found');
    }

    if (vendor.status !== 'APPROVED_LOGIN') {
      throw new BadRequestError('Cannot submit documents in current status');
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

    // Notify all admins via system notification
    try {
      const admins = await User.find({ role: 'ADMIN', isActive: true }, '_id').lean();
      
      if (admins.length > 0) {
        const notifications = admins.map(a => ({
          userId: a._id.toString(),
          type: 'DOCUMENT_VERIFIED' as const, // generic type for document updates
          title: 'Vendor Documents Submitted',
          message: `${vendor.companyName} has submitted ${documentCount} document(s) for review.`,
          link: '/admin/documents',
          metadata: { vendorId: vendor._id.toString() }
        }));
        
        await createBulkNotifications(notifications);
      }
    } catch (notifError) {
      console.error('Failed to send bulk admin notifications:', notifError);
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Documents submitted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

