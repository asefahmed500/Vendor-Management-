import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import Vendor from '@/lib/db/models/Vendor';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError } from '@/lib/middleware/errorHandler';
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

    if (!vendor || vendor.status !== 'APPROVED') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Only approved vendors can view proposals' },
        { status: 403 }
      );
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {
      status: 'OPEN',
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const proposals = await Proposal.find(query)
      .populate('createdBy', 'email')
      .sort({ deadline: 1, createdAt: -1 })
      .lean();

    const proposalsWithSubmissionInfo = await Promise.all(
      proposals.map(async (proposal) => {
        const existingSubmission = await ProposalSubmission.findOne({
          proposalId: proposal._id,
          vendorId: vendor._id,
        }).lean();

        return {
          ...proposal,
          hasSubmitted: !!existingSubmission,
          submissionStatus: existingSubmission?.status || null,
          submissionId: existingSubmission?._id || null,
        };
      })
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { proposals: serialize(proposalsWithSubmissionInfo) },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorProposals');
  }
}
