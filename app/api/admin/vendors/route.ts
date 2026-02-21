import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';
import { IVendor } from '@/lib/types/vendor';
import { ZodError } from 'zod';
import { createVendorSchema } from '@/lib/validation/schemas/auth';
import { vendorListFiltersSchema } from '@/lib/validation/schemas/vendor';
import { sanitizeSearchQuery } from '@/lib/utils/sanitize';

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
    const filters = vendorListFiltersSchema.parse(Object.fromEntries(searchParams));

    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      const sanitizedSearch = sanitizeSearchQuery(filters.search);
      query.$or = [
        { companyName: { $regex: sanitizedSearch, $options: 'i' } },
        { contactPerson: { $regex: sanitizedSearch, $options: 'i' } },
      ];
    }

    const sort: Record<string, 1 | -1> = {};
    sort[filters.sortBy] = filters.sortOrder === 'asc' ? 1 : -1;

    const skip = (filters.page - 1) * filters.pageSize;

    const [vendors, total] = await Promise.all([
      Vendor.find(query)
        .populate('userId', 'email isActive')
        .sort(sort)
        .skip(skip)
        .limit(filters.pageSize)
        .lean(),
      Vendor.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / filters.pageSize);

    return NextResponse.json<ApiResponse<PaginatedResponse<IVendor>>>(
      {
        success: true,
        data: {
          items: vendors.map((v: unknown) => {
            const vendor = v as Record<string, unknown>;
            return {
              _id: vendor._id as string,
              userId: vendor.userId as string,
              companyName: vendor.companyName as string,
              contactPerson: vendor.contactPerson as string,
              phone: vendor.phone as string,
              address: vendor.address as IVendor['address'],
              companyType: vendor.companyType as string | undefined,
              taxId: vendor.taxId as string | undefined,
              status: vendor.status as IVendor['status'],
              rejectionReason: vendor.rejectionReason as string | undefined,
              approvalDate: vendor.approvalDate as Date | undefined,
              certificateNumber: vendor.certificateNumber as string | undefined,
              registrationDate: vendor.createdAt as Date,
              createdAt: vendor.createdAt as Date,
              updatedAt: vendor.updatedAt as Date,
            };
          }),
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
    console.error('Get vendors error:', error);

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
    const validatedData = createVendorSchema.parse(body);

    await connectDB();

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    const userDoc = await User.create({
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      role: 'VENDOR',
    });

    const vendor = await Vendor.create({
      userId: userDoc._id,
      companyName: validatedData.companyName,
      contactPerson: validatedData.contactPerson,
      phone: validatedData.phone,
      address: validatedData.address,
      companyType: validatedData.companyType,
      taxId: validatedData.taxId,
      status: 'APPROVED_LOGIN',
    });

    userDoc.vendorProfile = vendor._id.toString();
    await userDoc.save();

    const ActivityLog = (await import('@/lib/db/models/ActivityLog')).default;
    await ActivityLog.create({
      vendorId: vendor._id,
      performedBy: user.userId,
      activityType: 'VENDOR_CREATED',
      description: `Vendor account created for ${validatedData.companyName}`,
    });

    return NextResponse.json<ApiResponse<{ vendor: IVendor }>>(
      {
        success: true,
        data: { vendor: vendor.toJSON() as unknown as IVendor },
        message: 'Vendor created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create vendor error:', error);

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
