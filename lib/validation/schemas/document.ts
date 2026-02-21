import { z } from 'zod';

// Verify schema - comments optional
export const documentVerifySchema = z.object({
  comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

// Reject schema - comments required
export const documentRejectSchema = z.object({
  comments: z.string().min(1, 'Rejection reason is required').max(500, 'Comments cannot exceed 500 characters'),
});

// Legacy schema for backwards compatibility
export const documentVerificationSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

export const documentUploadSchema = z.object({
  documentTypeId: z.string().min(1, 'Document type is required'),
  file: z.any()
    .refine((file) => file && file.size > 0, 'File is required')
    .refine((file) => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file && file.size <= maxSize;
    }, 'File size must be less than 10MB')
    .refine((file) => {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      return file && allowedTypes.includes(file.type);
    }, 'File type must be PDF, JPG, PNG, or DOCX'),
});

export const submitDocumentsSchema = z.object({
  documentIds: z.array(z.string()).min(1, 'At least one document is required'),
});

export const documentTypeSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters'),
  category: z.enum(['BUSINESS_REGISTRATION', 'TAX', 'BANKING', 'CERTIFICATES_LICENCES', 'INSURANCE', 'CUSTOM']),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  isRequired: z.boolean().default(true),
  allowedFormats: z.array(z.string()).default([
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
  maxSizeMB: z.number().int().positive().max(50).default(10),
});

export const updateDocumentTypeSchema = documentTypeSchema.partial().extend({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').optional(),
});

export type DocumentVerificationInput = z.infer<typeof documentVerificationSchema>;
export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type SubmitDocumentsInput = z.infer<typeof submitDocumentsSchema>;
export type DocumentTypeInput = z.infer<typeof documentTypeSchema>;
export type UpdateDocumentTypeInput = z.infer<typeof updateDocumentTypeSchema>;
