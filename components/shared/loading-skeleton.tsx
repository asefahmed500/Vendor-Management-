import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'list' | 'stat' | 'header';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ type = 'card', count = 1, className = '' }: LoadingSkeletonProps) {
  const renderCardSkeleton = () => (
    <div className={cn('rounded-2xl border bg-card p-6 space-y-4 animate-pulse', className)}>
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-8 bg-muted/50 rounded w-3/4" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted/30 rounded w-full" />
        <div className="h-3 bg-muted/30 rounded w-5/6" />
        <div className="h-3 bg-muted/30 rounded w-4/6" />
      </div>
      <div className="flex gap-3 pt-4">
        <div className="h-9 bg-muted rounded-lg w-24" />
        <div className="h-9 bg-muted/50 rounded-lg w-24" />
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className={cn('space-y-3', className)}>
      <div className="flex gap-4 p-4 border rounded-xl">
        <div className="h-4 bg-muted rounded w-1/6 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse delay-75" />
        <div className="h-4 bg-muted rounded w-1/5 animate-pulse delay-100" />
        <div className="h-4 bg-muted rounded w-1/6 animate-pulse delay-150" />
        <div className="h-4 bg-muted rounded w-20 animate-pulse delay-200" />
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className={cn('flex items-center gap-4 p-4 border rounded-xl animate-pulse', className)}>
      <div className="h-12 w-12 bg-muted rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-3 bg-muted/50 rounded w-1/2" />
      </div>
      <div className="h-8 bg-muted rounded-lg w-20" />
    </div>
  );

  const renderStatSkeleton = () => (
    <div className={cn('rounded-2xl border bg-card p-6 space-y-3 animate-pulse', className)}>
      <div className="h-10 w-10 bg-muted rounded-xl" />
      <div className="h-8 bg-muted/50 rounded w-20" />
      <div className="h-3 bg-muted/30 rounded w-3/4" />
    </div>
  );

  const renderHeaderSkeleton = () => (
    <div className={cn('space-y-4 animate-pulse', className)}>
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-4 bg-muted/50 rounded w-1/2" />
    </div>
  );

  const renderers = {
    card: renderCardSkeleton,
    table: renderTableSkeleton,
    list: renderListSkeleton,
    stat: renderStatSkeleton,
    header: renderHeaderSkeleton,
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderers[type]()}</div>
      ))}
    </>
  );
}

// Spinner component for inline loading states
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('animate-spin text-primary', sizeClasses[size], className)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="animate-spin">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );
}

// Full page loading overlay
export function LoadingPage({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
