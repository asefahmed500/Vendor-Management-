import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Vendor from '@/lib/db/models/Vendor';
import User from '@/lib/db/models/User';
import { adminGuard } from '@/lib/auth/guards';
import { ApiResponse, PaginatedResponse } from '@/lib/types/api';
import { IVendor } from '@/lib/types/vendor';
import { ZodError, z } from 'zod';
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
          items: vendors.map((v) => v as unknown as IVendor),
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
    const generatePassword = body.generatePassword === true;
    
    const createSchema = z.object({
      email: z.string().min(1, 'Email is required').email('Invalid email'),
      companyName: z.string().min(2, 'Company name required'),
      contactPerson: z.string().min(2, 'Contact person required'),
      phone: z.string().min(1, 'Phone required'),
      companyType: z.string().optional(),
      taxId: z.string().optional(),
      address: z.string().optional(),
    });
    
    const validatedData = createSchema.parse(body);

    await connectDB();

    const existingUser = await User.findOne({ email: validatedData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    let password: string;
    let tempPassword: string | undefined;
    
    if (generatePassword) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
      let generated = '';
      for (let i = 0; i < 12; i++) {
        generated += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      tempPassword = generated;
      password = generated;
    } else {
      password = body.password || '';
      if (!password || password.length < 8) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Password must be at least 8 characters' },
          { status: 400 }
        );
      }
    }

    const userDoc = await User.create({
      name: validatedData.contactPerson || validatedData.companyName,
      email: validatedData.email.toLowerCase(),
      password: password,
      role: 'VENDOR',
      mustChangePassword: generatePassword,
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
      performedBy: user.id,
      activityType: 'VENDOR_CREATED',
      description: `Vendor account created for ${validatedData.companyName}`,
    });

    const responseData: any = { vendor: vendor.toJSON() as unknown as IVendor };
    if (tempPassword) {
      responseData.tempPassword = tempPassword;
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: responseData,
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
