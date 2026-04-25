import { serialize } from '@/lib/utils/serialization';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Document from '@/lib/db/models/Document';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IDocument } from '@/lib/types/document';
import { handleApiError } from '@/lib/middleware/errorHandler';

interface DocumentWithVendor {
  _id: string;
  vendorId: {
    companyName?: string;
    userId?: {
      email?: string;
    };
  };
  documentTypeId?: {
    name: string;
  };
  fileName: string;
  originalName: string;
  fileUrl: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  isRequired: boolean;
  uploadedAt: Date;
  verification?: {
    status: string;
    comments?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface PopulatedDocument extends Omit<IDocument, 'vendorId' | 'documentTypeId'> {
  vendorId: {
    companyName?: string;
    userId?: { email?: string };
  };
  documentTypeId?: { name: string };
}

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};

    if (status && status !== 'ALL') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fileName: { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } },
      ];
    }

    const documents = await Document.find(query)
      .populate('documentTypeId')
      .populate('verification')
      .populate({
        path: 'vendorId',
        populate: { path: 'userId', select: 'email' },
      })
      .sort({ createdAt: -1 })
      .lean();

    const serializedDocuments = serialize(documents) as unknown as PopulatedDocument[];

    const documentsWithVendorInfo = serializedDocuments.map((doc) => ({
      ...doc,
      vendorName: doc.vendorId?.companyName || 'Unknown',
      vendorEmail: doc.vendorId?.userId?.email || 'Unknown',
      documentType: doc.documentTypeId,
    }));

    return NextResponse.json<ApiResponse<{ documents: typeof documentsWithVendorInfo }>>(
      {
        success: true,
        data: { documents: documentsWithVendorInfo },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetAdminDocuments');
  }
}
