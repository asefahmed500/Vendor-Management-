import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import DocumentType from '@/lib/db/models/DocumentType';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { z } from 'zod';

const documentTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['BUSINESS_REGISTRATION', 'TAX', 'BANKING', 'CERTIFICATES_LICENCES', 'INSURANCE', 'CUSTOM']),
  description: z.string().optional(),
  isRequired: z.boolean().default(false),
  allowedFormats: z.array(z.string()).default(['pdf', 'doc', 'docx', 'jpg', 'png']),
  maxSizeMB: z.number().min(1).max(50).default(10),
});

export async function GET(request: NextRequest) {
  try {
    const { authorized } = await adminGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const documentTypes = await DocumentType.find({ isActive: true })
      .sort({ category: 1, name: 1 })
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentTypes: documentTypes.map((dt) => ({
            ...dt,
            _id: dt._id.toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetDocumentTypes');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = documentTypeSchema.parse(body);

    await connectDB();

    const documentType = await DocumentType.create(validated);

    // Enterprise Audit Log
    await ActivityLog.create({
      performedBy: user.id,
      activityType: 'DOCUMENT_TYPE_CREATE',
      description: `Created new document type: ${documentType.name}`,
      metadata: { documentTypeId: documentType._id.toString(), name: documentType.name, category: documentType.category }
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documentType: {
            ...documentType.toObject(),
            _id: documentType._id.toString(),
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error' },
        { status: 400 }
      );
    }
    return handleApiError(error, 'CreateDocumentType');
  }
}
