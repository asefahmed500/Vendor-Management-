import { NextRequest, NextResponse } from 'next/server';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
import connectDB from '@/lib/db/connect';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';

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

    const submissions = await ProposalSubmission.find({ vendorId: id })
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          submissions: submissions.map((sub) => ({
            ...sub,
            _id: sub._id.toString(),
            proposalId: sub.proposalId?.toString(),
            vendorId: sub.vendorId?.toString(),
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorSubmissions');
  }
}
