import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IProposal } from '@/lib/types/proposal';
import { ZodError } from 'zod';
import { updateProposalSchema } from '@/lib/validation/schemas/proposal';

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

    const proposal = await Proposal.findById(id).populate('createdBy', 'email').lean();

    if (!proposal) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }

    const submissions = await ProposalSubmission.find({ proposalId: id })
      .populate('vendorId')
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json<ApiResponse<{ proposal: IProposal; submissions: unknown[] }>>(
      {
        success: true,
        data: {
          proposal: proposal as unknown as IProposal,
          submissions,
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

    const validatedData = updateProposalSchema.parse(body);

    await connectDB();

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }

    Object.assign(proposal, validatedData);

    if (validatedData.deadline) {
      proposal.deadline = new Date(validatedData.deadline);
    }

    await proposal.save();

    return NextResponse.json<ApiResponse<{ proposal: IProposal }>>(
      {
        success: true,
        data: { proposal: proposal.toJSON() as unknown as IProposal },
        message: 'Proposal updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update proposal error:', error);

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
          errors,
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

export async function DELETE(
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

    const proposal = await Proposal.findById(id);

    if (!proposal) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if (proposal.status === 'OPEN') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Cannot delete an open proposal' },
        { status: 400 }
      );
    }

    await ProposalSubmission.deleteMany({ proposalId: id });
    await Proposal.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Proposal deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete proposal error:', error);

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
