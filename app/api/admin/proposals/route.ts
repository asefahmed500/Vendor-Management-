import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import User from '@/lib/db/models/User';
import ActivityLog from '@/lib/db/models/ActivityLog';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';
import type { IProposal } from '@/lib/types/proposal';
import { handleApiError } from '@/lib/middleware/errorHandler';
import { createProposalSchema, proposalFiltersSchema } from '@/lib/validation/schemas/proposal';
import { createBulkNotifications } from '@/lib/notifications/service';
import { serialize } from '@/lib/utils/serialization';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = request.nextUrl;
    const filters = proposalFiltersSchema.parse(Object.fromEntries(searchParams));

    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {};
    sort[filters.sortBy] = filters.sortOrder === 'asc' ? 1 : -1;

    const skip = (filters.page - 1) * filters.pageSize;

    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate('createdBy', 'email')
        .sort(sort)
        .skip(skip)
        .limit(filters.pageSize)
        .lean(),
      Proposal.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / filters.pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<IProposal>>>(
      {
        success: true,
        data: {
          items: serialize(proposals) as unknown as IProposal[],
          pagination: {
            total,
            page: filters.page,
            pageSize: filters.pageSize,
            totalPages,
            hasNext: filters.page < totalPages,
            hasPrev: filters.page > 1,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GetProposals');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, user } = await adminGuard(request);

    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createProposalSchema.parse(body);

    await connectDB();

    const proposal = await Proposal.create({
      ...validatedData,
      deadline: new Date(validatedData.deadline),
      createdBy: user.id,
    });

    // Enterprise Audit Log
    await ActivityLog.create({
      performedBy: user.id,
      activityType: 'PROPOSAL_CREATE',
      description: `Created new RFP: ${proposal.title}`,
      metadata: { proposalId: proposal._id.toString(), title: proposal.title }
    });

    // Notify all vendors about the new RFP
    try {
      const vendors = await User.find({ role: 'VENDOR', isActive: true }, '_id').lean();
      
      if (vendors.length > 0) {
        const notifications = vendors.map(v => ({
          userId: v._id.toString(),
          type: 'PROPOSAL_UPDATE' as const,
          title: 'New Request for Proposal',
          message: `A new RFP "${proposal.title}" has been published.`,
          link: '/vendor/proposals',
          metadata: { proposalId: proposal._id.toString() }
        }));
        
        await createBulkNotifications(notifications);
      }
    } catch (notifError) {
      console.error('Failed to send bulk notifications:', notifError);
    }

    return NextResponse.json<ApiResponse<{ proposal: IProposal }>>(
      {
        success: true,
        data: { proposal: serialize(proposal) as unknown as IProposal },
        message: 'Proposal created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'CreateProposal');
  }
}
