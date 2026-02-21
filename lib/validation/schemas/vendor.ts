import { z } from 'zod';
import { VendorStatus } from '@/lib/types/vendor';

export const updateVendorSchema = z.object({
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(200, 'Company name cannot exceed 200 characters')
    .optional(),
  contactPerson: z.string()
    .min(1, 'Contact person is required')
    .max(100, 'Contact person name cannot exceed 100 characters')
    .optional(),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[+]?[\d\s\-()]+$/, 'Invalid phone number format')
    .optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
  }).optional(),
  companyType: z.enum(['LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other']).optional(),
  taxId: z.string().optional(),
});

export const updateVendorStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED_LOGIN', 'DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const),
  rejectionReason: z.string().optional(),
});

export const approveRegistrationSchema = z.object({
  comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

export const rejectRegistrationSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').max(500, 'Reason cannot exceed 500 characters'),
});

export const finalApprovalSchema = z.object({
  comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

export const requestRevisionsSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'At least one document must be specified'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
});

export const vendorListFiltersSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED_LOGIN', 'DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type UpdateVendorStatusInput = z.infer<typeof updateVendorStatusSchema>;
export type ApproveRegistrationInput = z.infer<typeof approveRegistrationSchema>;
export type RejectRegistrationInput = z.infer<typeof rejectRegistrationSchema>;
export type FinalApprovalInput = z.infer<typeof finalApprovalSchema>;
export type RequestRevisionsInput = z.infer<typeof requestRevisionsSchema>;
export type VendorListFiltersInput = z.infer<typeof vendorListFiltersSchema>;
