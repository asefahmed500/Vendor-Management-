import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import { vendorGuard } from '@/lib/auth/guards';
import { generateCertificatePDF } from '@/lib/services/certificate.service';
import { IVendor } from '@/lib/types/vendor';
import { handleApiError, NotFoundError, ForbiddenError } from '@/lib/middleware/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await vendorGuard(request);

    if (!authorized || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const vendor = await Vendor.findOne({ userId: user.id });

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found');
    }

    if (vendor.status !== 'APPROVED') {
      throw new ForbiddenError('Certificate not available. Vendor must be approved.');
    }

    const pdf = generateCertificatePDF(vendor.toJSON() as unknown as IVendor);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${vendor.certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

