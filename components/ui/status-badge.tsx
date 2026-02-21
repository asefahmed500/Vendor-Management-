'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { Badge } from './badge';

type VendorStatus = 'PENDING' | 'APPROVED_LOGIN' | 'DOCUMENTS_SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: VendorStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<VendorStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info'; icon: string }> = {
  PENDING: {
    label: 'Pending',
    variant: 'warning',
    icon: '⏳',
  },
  APPROVED_LOGIN: {
    label: 'Approved for Login',
    variant: 'info',
    icon: '🔐',
  },
  DOCUMENTS_SUBMITTED: {
    label: 'Documents Submitted',
    variant: 'default',
    icon: '📄',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    variant: 'warning',
    icon: '🔍',
  },
  APPROVED: {
    label: 'Approved',
    variant: 'success',
    icon: '✓',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'danger',
    icon: '✕',
  },
};

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, size = 'md', ...props }, ref) => {
    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        size={size}
        className={className}
        {...props}
      >
        <span className="text-base">{config.icon}</span>
        <span>{config.label}</span>
      </Badge>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';
