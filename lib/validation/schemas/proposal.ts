import { z } from 'zod';
import { ProposalStatus, ProposalCategory } from '@/lib/types/proposal';

// Base proposal schema (without refinements)
export const baseProposalSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .min(50, 'Description must be at least 50 characters'),
  category: z.enum(['IT_SERVICES', 'CONSTRUCTION', 'CONSULTING', 'SUPPLY_CHAIN', 'MARKETING', 'MANUFACTURING', 'PROFESSIONAL_SERVICES', 'OTHER']),
  budgetMin: z.number()
    .min(0, 'Budget cannot be negative'),
  budgetMax: z.number()
    .min(0, 'Budget cannot be negative'),
  deadline: z.string()
    .refine((val) => !isNaN(Date.parse(val)), 'Invalid deadline')
    .refine((val) => new Date(val) > new Date(), 'Deadline must be in the future'),
  requirements: z.array(z.string().min(1)).min(1, 'At least one requirement is needed'),
});

// Create schema with budget validation
export const createProposalSchema = baseProposalSchema.refine(data => data.budgetMax >= data.budgetMin, {
  message: 'Maximum budget must be greater than or equal to minimum budget',
  path: ['budgetMax'],
});

// Update schema - partial base schema with additional fields
export const updateProposalSchema = baseProposalSchema.partial().extend({
  status: z.enum(['DRAFT', 'OPEN', 'CLOSED', 'AWARDED']).optional(),
  attachments: z.array(z.string()).optional(),
});

export const createSubmissionSchema = z.object({
  proposalId: z.string().min(1, 'Proposal ID is required'),
  proposedAmount: z.number()
    .min(0, 'Amount cannot be negative'),
  timeline: z.string()
    .min(10, 'Timeline must be at least 10 characters')
    .max(500, 'Timeline cannot exceed 500 characters'),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  approach: z.string()
    .min(50, 'Approach must be at least 50 characters')
    .max(2000, 'Approach cannot exceed 2000 characters'),
  teamSize: z.number()
    .int('Team size must be a whole number')
    .min(1, 'Team size must be at least 1')
    .optional(),
});

export const updateSubmissionSchema = createSubmissionSchema.partial().extend({
  attachments: z.array(z.string()).optional(),
});

export const rankingSchema = z.object({
  rank: z.number()
    .int('Rank must be a whole number')
    .min(1, 'Rank must be at least 1'),
  score: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  technicalScore: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  financialScore: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  experienceScore: z.number()
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  comments: z.string()
    .max(2000, 'Comments cannot exceed 2000 characters')
    .optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
});

export const proposalFiltersSchema = z.object({
  status: z.enum(['DRAFT', 'OPEN', 'CLOSED', 'AWARDED']).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type UpdateSubmissionInput = z.infer<typeof updateSubmissionSchema>;
export type RankingInput = z.infer<typeof rankingSchema>;
export type ProposalFiltersInput = z.infer<typeof proposalFiltersSchema>;
