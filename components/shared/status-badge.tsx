import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

export type StatusVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface StatusConfig {
  variant: StatusVariant;
  label: string;
  icon?: LucideIcon;
  description?: string;
}

// Unified status configuration for consistent UI across the app
// Using namespaced keys to avoid conflicts between different entity types
export const STATUS_CONFIGS: Record<string, StatusConfig> = {
  // Vendor Status
  VENDOR_PENDING: {
    variant: 'warning',
    label: 'Pending Registration',
    description: 'Awaiting admin approval for login access',
  },
  VENDOR_APPROVED_LOGIN: {
    variant: 'info',
    label: 'Access Approved',
    description: 'You can now login and submit documents',
  },
  VENDOR_DOCUMENTS_SUBMITTED: {
    variant: 'default',
    label: 'Documents Submitted',
    description: 'Documents are under review',
  },
  VENDOR_UNDER_REVIEW: {
    variant: 'warning',
    label: 'Under Review',
    description: 'Admin is reviewing your documents',
  },
  VENDOR_APPROVED: {
    variant: 'success',
    label: 'Approved',
    description: 'Your account is fully verified',
  },
  VENDOR_VERIFIED: {
    variant: 'success',
    label: 'Verified',
    description: 'Verified partner',
  },
  VENDOR_ACCEPTED: {
    variant: 'success',
    label: 'Accepted',
    description: 'Accepted',
  },
  VENDOR_REJECTED: {
    variant: 'danger',
    label: 'Rejected',
    description: 'Application was rejected',
  },

  // Document Status
  DOC_UPLOADED: {
    variant: 'default',
    label: 'Uploaded',
    description: 'Document uploaded',
  },
  DOC_PENDING: {
    variant: 'warning',
    label: 'Pending Verification',
    description: 'Awaiting verification',
  },
  DOC_VERIFIED: {
    variant: 'success',
    label: 'Verified',
    description: 'Document verified',
  },
  DOC_REQUIRES_REVISION: {
    variant: 'warning',
    label: 'Requires Revision',
    description: 'Please update and resubmit',
  },
  DOC_REJECTED: {
    variant: 'danger',
    label: 'Rejected',
    description: 'Document was rejected',
  },

  // Proposal Status
  PROPOSAL_DRAFT: {
    variant: 'default',
    label: 'Draft',
    description: 'Draft proposal',
  },
  PROPOSAL_OPEN: {
    variant: 'success',
    label: 'Open',
    description: 'Accepting submissions',
  },
  PROPOSAL_CLOSED: {
    variant: 'danger',
    label: 'Closed',
    description: 'No longer accepting submissions',
  },
  PROPOSAL_AWARDED: {
    variant: 'info',
    label: 'Awarded',
    description: 'Proposal awarded',
  },

  // Submission Status
  SUBMISSION_SUBMITTED: {
    variant: 'default',
    label: 'Submitted',
    description: 'Proposal submitted',
  },
  SUBMISSION_UNDER_REVIEW: {
    variant: 'warning',
    label: 'Under Review',
    description: 'Being reviewed',
  },
  SUBMISSION_SHORTLISTED: {
    variant: 'info',
    label: 'Shortlisted',
    description: 'Shortlisted for consideration',
  },
  SUBMISSION_AWARDED: {
    variant: 'success',
    label: 'Awarded',
    description: 'Congratulations! You won this proposal',
  },
  SUBMISSION_NOT_AWARDED: {
    variant: 'danger',
    label: 'Not Awarded',
    description: 'This proposal was awarded to another vendor',
  },
};

// Helper to get the correct config key based on entity type and status
export function getStatusConfig(entityType: 'vendor' | 'document' | 'proposal' | 'submission', status: string): StatusConfig {
  const prefix = entityType === 'vendor' ? 'VENDOR' :
                 entityType === 'document' ? 'DOC' :
                 entityType === 'proposal' ? 'PROPOSAL' : 'SUBMISSION';
  const key = `${prefix}_${status}` as keyof typeof STATUS_CONFIGS;
  return STATUS_CONFIGS[key] || {
    variant: 'default',
    label: status.replace(/_/g, ' '),
  };
}

export interface StatusBadgeProps {
  status: string;
  entityType?: 'vendor' | 'document' | 'proposal' | 'submission';
  showFullLabel?: boolean;
  className?: string;
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20 dark:border-emerald-900/50 dark:text-emerald-400',
  warning: 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20 dark:border-amber-900/50 dark:text-amber-400',
  danger: 'bg-rose-500/10 text-rose-600 border-rose-200 hover:bg-rose-500/20 dark:border-rose-900/50 dark:text-rose-400',
  info: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20 dark:border-blue-900/50 dark:text-blue-400',
  default: 'bg-muted text-muted-foreground border-border hover:bg-muted/70',
};

export function StatusBadge({ status, entityType = 'vendor', showFullLabel = false, className = '' }: StatusBadgeProps) {
  const config = getStatusConfig(entityType, status);
  const label = showFullLabel ? config.label : status.replace(/_/g, ' ');

  return (
    <Badge
      variant="outline"
      className={`${variantStyles[config.variant]} ${className} px-3 py-1 text-xs font-semibold uppercase tracking-wider border`}
    >
      {label}
    </Badge>
  );
}

export function getStatusVariant(status: string): StatusVariant {
  // Default to checking vendor status first for backward compatibility
  const config = getStatusConfig('vendor', status);
  return config.variant;
}

export function getStatusLabel(status: string): string {
  const config = getStatusConfig('vendor', status);
  return config.label;
}
