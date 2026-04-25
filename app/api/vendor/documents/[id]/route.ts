import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Document from '@/lib/db/models/Document';
import Vendor from '@/lib/db/models/Vendor';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { deleteFile as deleteCloudinaryFile } from '@/lib/cloudinary/config';
import { handleApiError, NotFoundError, BadRequestError } from '@/lib/middleware/errorHandler';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id });

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found');
    }

    const document = await Document.findOne({ _id: id, vendorId: vendor._id });

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    if (document.status !== 'PENDING') {
      throw new BadRequestError('Cannot delete a document that has been reviewed');
    }

    // Delete from Cloudinary FIRST, then delete from DB
    // This prevents orphaned Cloudinary files if DB deletion fails
    const publicId = document.filePath; // filePath stores Cloudinary publicId
    let cloudinaryDeleted = false;

    if (publicId) {
      try {
        await deleteCloudinaryFile(publicId);
        cloudinaryDeleted = true;
      } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error);
        // Proceed with DB deletion even if Cloudinary fails to avoid inconsistency
        cloudinaryDeleted = false;
      }
    }

    // Only delete from DB after attempting Cloudinary deletion
    await Document.findByIdAndDelete(id);

    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.id,
      activityType: 'DOCUMENT_DELETED',
      description: `Document deleted${cloudinaryDeleted ? '' : ' (Cloudinary cleanup failed)'}`,
      metadata: { documentId: id, fileName: document.originalName, cloudinaryDeleted },
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Document deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

