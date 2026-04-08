import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import Document from '@/lib/db/models/Document';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized } = await adminGuard(request);

    if (!authorized) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await params;

    const documents = await Document.find({ vendorId: id })
      .populate('documentTypeId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          documents: documents.map((doc) => ({
            ...doc,
            _id: doc._id.toString(),
            vendorId: doc.vendorId?.toString(),
            documentTypeId: doc.documentTypeId ? {
              _id: (doc.documentTypeId as any)._id?.toString(),
              name: (doc.documentTypeId as any).name,
            } : null,
            uploadedBy: doc.uploadedBy?.toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorDocuments');
  }
}
