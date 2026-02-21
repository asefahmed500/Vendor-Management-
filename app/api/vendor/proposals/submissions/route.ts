import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IProposalSubmission } from '@/lib/types/proposal';

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
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Vendor profile not found' },
        { status: 404 }
      );
    }

    const submissions = await ProposalSubmission.find({ vendorId: vendor._id })
      .populate('proposalId')
      .populate('ranking')
      .sort({ submittedAt: -1, createdAt: -1 })
      .lean();

    const stats = {
      total: submissions.length,
      draft: submissions.filter((s) => s.status === 'DRAFT').length,
      submitted: submissions.filter((s) => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW').length,
      accepted: submissions.filter((s) => s.status === 'ACCEPTED').length,
      rejected: submissions.filter((s) => s.status === 'REJECTED').length,
      averageScore: 0,
    };

    const scoredSubmissions = submissions.filter((s) => (s as unknown as { ranking?: { score?: number } }).ranking?.score);
    if (scoredSubmissions.length > 0) {
      const totalScore = scoredSubmissions.reduce((sum: number, s: unknown) => {
        return sum + ((s as unknown as { ranking?: { score?: number } }).ranking?.score || 0);
      }, 0);
      stats.averageScore = totalScore / scoredSubmissions.length;
    }

    return NextResponse.json<ApiResponse<{ submissions: IProposalSubmission[]; stats: typeof stats }>>(
      {
        success: true,
        data: {
          submissions: submissions as unknown as IProposalSubmission[],
          stats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get submissions error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
