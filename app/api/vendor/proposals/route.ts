import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import Vendor from '@/lib/db/models/Vendor';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';
import type { IProposal } from '@/lib/types/proposal';

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
      (proposals as any[]).map(async (proposal) => {
        const ProposalSubmission = (await import('@/lib/db/models/ProposalSubmission')).default;
        const existingSubmission = await ProposalSubmission.findOne({
          proposalId: proposal._id,
          vendorId: vendor._id,
        });

        return {
          ...proposal,
          hasSubmitted: !!existingSubmission,
          submissionStatus: existingSubmission?.status || null,
          submissionId: existingSubmission?._id || null,
        };
      })
    );

    return NextResponse.json<ApiResponse<{ proposals: typeof proposalsWithSubmissionInfo }>>(
      {
        success: true,
        data: { proposals: proposalsWithSubmissionInfo },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get proposals error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
