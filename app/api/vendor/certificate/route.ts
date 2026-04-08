import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import { vendorGuard } from '@/lib/auth/guards';
import { generateCertificatePDF } from '@/lib/services/certificate.service';
import { IVendor } from '@/lib/types/vendor';

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
      return NextResponse.json(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    if (vendor.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Certificate not available. Vendor must be approved.' },
        { status: 403 }
      );
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
    console.error('Certificate generation error:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
