export type VendorStatus =
  | 'PENDING'
  | 'APPROVED_LOGIN'
  | 'DOCUMENTS_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED';

export type ActivityType =
  | 'VENDOR_CREATED'
  | 'REGISTRATION_APPROVED'
  | 'REGISTRATION_REJECTED'
  | 'DOCUMENTS_SUBMITTED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_VERIFIED'
  | 'DOCUMENT_REJECTED'
  | 'UNDER_REVIEW'
  | 'FINAL_APPROVAL'
  | 'FINAL_REJECTION'
  | 'REVISION_REQUESTED'
  | 'PROFILE_UPDATED'
  | 'LOGIN'
  | 'PROPOSAL_CREATE'
  | 'SUBMISSION_RANKING_UPDATE'
  | 'DOCUMENT_TYPE_CREATE';

export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IVendor {
  _id: string;
  userId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  address?: IAddress;
  companyType?: string;
  taxId?: string;
  status: VendorStatus;
  rejectionReason?: string;
  approvalDate?: Date;
  certificateNumber?: string;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog {
  _id: string;
  vendorId?: string;
  performedBy: string;
  activityType: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateVendorInput {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  address?: IAddress;
  companyType?: string;
  taxId?: string;
}

export interface IVendorStats {
  total: number;
  pending: number;
  approvedLogin: number;
  documentsSubmitted: number;
  underReview: number;
  approved: number;
  rejected: number;
}

export interface IVendorListFilters {
  status?: VendorStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
