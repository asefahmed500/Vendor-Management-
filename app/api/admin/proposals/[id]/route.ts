import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { IProposal } from '@/lib/types/proposal';
import { handleApiError, NotFoundError, BadRequestError } from '@/lib/middleware/errorHandler';
import { updateProposalSchema } from '@/lib/validation/schemas/proposal';
import { serialize } from '@/lib/utils/serialization';

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
      throw new NotFoundError('Proposal not found');
    }

    const submissions = await ProposalSubmission.find({ proposalId: id })
      .populate('vendorId')
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json<ApiResponse<{ proposal: IProposal; submissions: unknown[] }>>(
      {
        success: true,
        data: {
          proposal: serialize(proposal) as unknown as IProposal,
          submissions: serialize(submissions),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetProposalById');
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
      throw new NotFoundError('Proposal not found');
    }

    Object.assign(proposal, validatedData);

    if (validatedData.deadline) {
      proposal.deadline = new Date(validatedData.deadline);
    }

    await proposal.save();

    return NextResponse.json<ApiResponse<{ proposal: IProposal }>>(
      {
        success: true,
        data: { proposal: serialize(proposal) as unknown as IProposal },
        message: 'Proposal updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'UpdateProposal');
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
      throw new NotFoundError('Proposal not found');
    }

    // Business Logic: Don't delete open proposals
    if (proposal.status === 'OPEN') {
      throw new BadRequestError('Cannot delete an active procurement channel (Open RFP)');
    }

    await ProposalSubmission.deleteMany({ proposalId: id });
    await Proposal.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: 'Proposal purged from registry successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'DeleteProposal');
  }
}

