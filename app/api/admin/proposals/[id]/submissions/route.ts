import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import ProposalRanking from '@/lib/db/models/ProposalRanking';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IProposalSubmission, IProposalRanking } from '@/lib/types/proposal';
import { ZodError } from 'zod';
import { rankingSchema } from '@/lib/validation/schemas/proposal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectDB();

    const submissions = await ProposalSubmission.find({ proposalId: id })
      .populate('vendorId')
      .populate({
        path: 'ranking',
        model: 'ProposalRanking',
      })
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json<ApiResponse<{ submissions: IProposalSubmission[] }>>(
      {
        success: true,
        data: { submissions: submissions as unknown as IProposalSubmission[] },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    await connectDB();

    if (body.action === 'rank' && body.submissionId) {
      const validatedData = rankingSchema.parse(body);

      const submission = await ProposalSubmission.findById(body.submissionId);

      if (!submission) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Submission not found' },
          { status: 404 }
        );
      }

      const existingRanking = await ProposalRanking.findOne({ submissionId: body.submissionId });

      let ranking;
      if (existingRanking) {
        existingRanking.rank = validatedData.rank;
        existingRanking.score = validatedData.score;
        existingRanking.technicalScore = validatedData.technicalScore;
        existingRanking.financialScore = validatedData.financialScore;
        existingRanking.experienceScore = validatedData.experienceScore;
        existingRanking.comments = validatedData.comments;
        existingRanking.strengths = validatedData.strengths;
        existingRanking.weaknesses = validatedData.weaknesses;
        ranking = await existingRanking.save();
      } else {
        ranking = await ProposalRanking.create({
          proposalId: id,
          submissionId: body.submissionId,
          rankedBy: user.id,
          ...validatedData,
        });
      }

      submission.status = validatedData.rank === 1 ? 'ACCEPTED' : 'UNDER_REVIEW';
      await submission.save();

      // Enterprise Audit Log
      await ActivityLog.create({
        userId: user.id,
        userEmail: user.email,
        action: 'SUBMISSION_RANKING_UPDATE',
        resourceType: 'SUBMISSION',
        resourceId: submission._id.toString(),
        description: `Ranked submission for proposal ${submission.proposalId} at position #${ranking.rank}`,
        metadata: { rank: ranking.rank, score: ranking.score }
      });

      // Notify Vendor about the ranking/status change
      try {
        const { notifyProposalUpdate } = await import('@/lib/notifications/service');
        const Vendor = (await import('@/lib/db/models/Vendor')).default;
        const Proposal = (await import('@/lib/db/models/Proposal')).default;
        
        const [vendor, proposal] = await Promise.all([
          Vendor.findById(submission.vendorId),
          Proposal.findById(submission.proposalId)
        ]);
        
        if (vendor && proposal) {
          await notifyProposalUpdate(
            vendor.userId.toString(),
            proposal.title,
            submission.status
          );
        }
      } catch (notifError) {
        console.error('Failed to notify vendor of ranking:', notifError);
      }

      return NextResponse.json<ApiResponse<{ ranking: IProposalRanking }>>(
        {
          success: true,
          data: { ranking: ranking.toJSON() as unknown as IProposalRanking },
          message: 'Submission ranked successfully',
        },
        { status: 200 }
      );
    }

    if (body.action === 'status') {
      const { submissionId, status, comments } = body;

      const submission = await ProposalSubmission.findById(submissionId);

      if (!submission) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Submission not found' },
          { status: 404 }
        );
      }

      submission.status = status;
      if (comments) {
        submission.adminComments = comments;
      }
      await submission.save();

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: 'Submission status updated successfully',
        },
        { status: 200 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update submissions error:', error);

    if (error instanceof ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      const errors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(fieldErrors)) {
        if (value) {
          errors[key] = value;
        }
      }
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Validation error',
          errors: errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
