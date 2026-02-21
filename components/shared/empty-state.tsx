import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="mb-4 p-4 bg-muted/50 rounded-2xl">
          <Icon className="h-10 w-10 text-muted-foreground/50" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Button
          variant={action.variant || 'default'}
          onClick={action.onClick}
          className="min-w-[140px]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function EmptyDocuments({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={(() => require('lucide-react').FileText)()}
      title="No documents uploaded"
      description="Upload your business documents to begin the verification process."
      action={onCreate ? { label: 'Upload Document', onClick: onCreate } : undefined}
    />
  );
}

export function EmptyVendors({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={(() => require('lucide-react').Users)()}
      title="No vendors found"
      description="No vendors match your current filters or none have been registered yet."
      action={onCreate ? { label: 'Add Vendor', onClick: onCreate } : undefined}
    />
  );
}

export function EmptyProposals({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={(() => require('lucide-react').Briefcase)()}
      title="No proposals available"
      description="Check back later for new opportunities to submit your proposals."
      action={onCreate ? { label: 'Create Proposal', onClick: onCreate, variant: 'outline' } : undefined}
    />
  );
}

export function EmptySubmissions() {
  return (
    <EmptyState
      icon={(() => require('lucide-react').FileText)()}
      title="No submissions yet"
      description="You haven't submitted any proposals. Browse available opportunities to get started."
    />
  );
}

export function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={(() => require('lucide-react').Search)()}
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or filters to find what you're looking for."
      action={{ label: 'Clear Search', onClick: onClear, variant: 'outline' }}
    />
  );
}
