'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => {
    const baseStyles = 'shrink-0 bg-border';

    const variants = {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    };

    return (
      <div
        ref={ref}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={orientation}
        className={cn(baseStyles, orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full', className)}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
