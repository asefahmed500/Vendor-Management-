export type ProposalStatus = 'DRAFT' | 'OPEN' | 'CLOSED' | 'AWARDED';

export type ProposalCategory =
  | 'IT_SERVICES'
  | 'CONSTRUCTION'
  | 'CONSULTING'
  | 'SUPPLY_CHAIN'
  | 'MARKETING'
  | 'MANUFACTURING'
  | 'PROFESSIONAL_SERVICES'
  | 'OTHER';

export interface IProposal {
  _id: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
  requirements: string[];
  attachments?: string[];
  status: ProposalStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposalSubmission {
  _id: string;
  proposalId: string;
  vendorId: string;
  proposedAmount: number;
  timeline: string;
  description: string;
  approach: string;
  teamSize?: number;
  attachments?: string[];
  status: SubmissionStatus;
  adminComments?: string;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';

export interface IProposalRanking {
  _id: string;
  proposalId: string;
  submissionId: string;
  rankedBy: string;
  rank: number;
  score: number;
  technicalScore: number;
  financialScore: number;
  experienceScore: number;
  comments?: string;
  strengths?: string[];
  weaknesses?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposalStats {
  total: number;
  open: number;
  closed: number;
  awarded: number;
  draft: number;
  totalSubmissions: number;
  pendingReview: number;
}

export interface IVendorProposalStats {
  totalSubmissions: number;
  accepted: number;
  rejected: number;
  pending: number;
  draft: number;
  averageScore: number;
}

export interface ICreateProposalInput {
  title: string;
  description: string;
  category: ProposalCategory | string;
  budgetMin: number;
  budgetMax: number;
  deadline: Date;
  requirements: string[];
}

export interface ICreateSubmissionInput {
  proposalId: string;
  proposedAmount: number;
  timeline: string;
  description: string;
  approach: string;
  teamSize?: number;
}

export interface IRankingInput {
  rank: number;
  score: number;
  technicalScore: number;
  financialScore: number;
  experienceScore: number;
  comments?: string;
  strengths?: string[];
  weaknesses?: string[];
}
