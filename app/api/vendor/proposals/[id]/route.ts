import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import Vendor from '@/lib/db/models/Vendor';
import ProposalSubmission from '@/lib/db/models/ProposalSubmission';
import { vendorGuard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import { handleApiError, NotFoundError, BadRequestError } from '@/lib/middleware/errorHandler';
import { createSubmissionSchema } from '@/lib/validation/schemas/proposal';
import { serialize } from '@/lib/utils/serialization';

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
      throw new NotFoundError('Proposal not found');
    }

    const vendor = await Vendor.findOne({ userId: user.id });

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

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          proposal: serialize(proposal),
          submission: submission ? serialize(submission) : undefined,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetVendorProposal');
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
      throw new NotFoundError('Proposal not found');
    }

    if (proposal.status !== 'OPEN') {
      throw new BadRequestError('This proposal is not open for submissions');
    }

    if (new Date(proposal.deadline) < new Date()) {
      throw new BadRequestError('This proposal has passed its deadline');
    }

    const vendor = await Vendor.findOne({ userId: user.id });

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
        throw new BadRequestError('You cannot modify a submitted proposal');
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

    // Notify Admin about new submission
    if (!existingSubmission) {
      try {
        const { createNotification } = await import('@/lib/notifications/service');
        const User = (await import('@/lib/db/models/User')).default;
        
        const admin = await User.findOne({ role: 'ADMIN' });
        if (admin) {
          await createNotification({
            userId: admin._id.toString(),
            type: 'PROPOSAL_UPDATE',
            title: 'New Proposal Submission',
            message: `Vendor "${vendor.companyName}" has submitted a proposal for "${proposal.title}".`,
            link: `/admin/proposals/${proposal._id}/submissions`,
            metadata: { 
              submissionId: submission._id.toString(), 
              vendorId: vendor._id.toString() 
            }
          });
        }
      } catch (notifError) {
        console.error('Failed to notify admin of submission:', notifError);
      }
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: { submission: serialize(submission) },
        message: existingSubmission ? 'Submission updated successfully' : 'Proposal submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'SubmitVendorProposal');
  }
}
