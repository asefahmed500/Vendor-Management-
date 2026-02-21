import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import Vendor from '@/lib/db/models/Vendor';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IProposal, IProposalSubmission } from '@/lib/types/proposal';
import { ZodError } from 'zod';
import { createSubmissionSchema } from '@/lib/validation/schemas/proposal';

export async function GET(
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

    const proposal = await Proposal.findById(id).lean();

    if (!proposal) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const vendor = await Vendor.findOne({ userId: user.userId });

    if (!vendor || vendor.status !== 'APPROVED') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Only approved vendors can view proposals' },
        { status: 403 }
      );
    }

    const submission = await ProposalSubmission.findOne({
      proposalId: id,
      vendorId: vendor._id,
    }).lean();

    return NextResponse.json<ApiResponse<{ proposal: IProposal; submission?: IProposalSubmission }>>(
      {
        success: true,
        data: {
          proposal: proposal as unknown as IProposal,
          submission: submission as unknown as IProposalSubmission | undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get proposal error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const body = await request.json();

    const validatedData = createSubmissionSchema.parse(body);

    await connectDB();

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if (proposal.status !== 'OPEN') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This proposal is not open for submissions' },
        { status: 400 }
      );
    }

    if (new Date(proposal.deadline) < new Date()) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'This proposal has passed its deadline' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ userId: user.userId });

    if (!vendor || vendor.status !== 'APPROVED') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Only approved vendors can submit proposals' },
        { status: 403 }
      );
    }

    const existingSubmission = await ProposalSubmission.findOne({
      proposalId: id,
      vendorId: vendor._id,
    });

    let submission;
    if (existingSubmission) {
      if (existingSubmission.status === 'SUBMITTED' || existingSubmission.status === 'UNDER_REVIEW') {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'You cannot modify a submitted proposal' },
          { status: 400 }
        );
      }

      Object.assign(existingSubmission, validatedData);
      submission = await existingSubmission.save();
    } else {
      const { proposalId, ...submissionData } = validatedData;
      submission = await ProposalSubmission.create({
        proposalId: id,
        vendorId: vendor._id,
        ...submissionData,
      });
    }

    return NextResponse.json<ApiResponse<{ submission: IProposalSubmission }>>(
      {
        success: true,
        data: { submission: submission.toJSON() as unknown as IProposalSubmission },
        message: existingSubmission ? 'Submission updated successfully' : 'Proposal submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Submit proposal error:', error);

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
