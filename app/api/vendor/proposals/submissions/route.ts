import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError, NotFoundError } from '@/lib/middleware/errorHandler';
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

    if (!vendor) {
      throw new NotFoundError('Vendor profile not found');
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

    const scoredSubmissions = submissions.filter((s) => (s as any).ranking?.score);
    if (scoredSubmissions.length > 0) {
      const totalScore = scoredSubmissions.reduce((sum: number, s: any) => {
        return sum + (s.ranking?.score || 0);
      }, 0);
      stats.averageScore = totalScore / scoredSubmissions.length;
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          submissions: serialize(submissions),
          stats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

