import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Proposal from '@/lib/db/models/Proposal';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';
import type { IProposal } from '@/lib/types/proposal';
import { ZodError } from 'zod';
import { createProposalSchema, proposalFiltersSchema } from '@/lib/validation/schemas/proposal';

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
          items: proposals as any[],
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
    console.error('Get proposals error:', error);

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

    return NextResponse.json<ApiResponse<{ proposal: IProposal }>>(
      {
        success: true,
        data: { proposal: proposal.toJSON() as any },
        message: 'Proposal created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create proposal error:', error);

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
      { success: false, error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
