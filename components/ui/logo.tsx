'use client';

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'icon' | 'compact';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ variant = 'full', size = 'md', className }: LogoProps) => {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', subtext: 'text-[10px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', subtext: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', subtext: 'text-sm' },
  };

  const s = sizes[size];

  if (variant === 'icon') {
    return (
      <div className={cn('relative', className)}>
        <div className={cn(s.icon, 'bg-gradient-to-br from-foreground to-muted-foreground rounded-lg flex items-center justify-center shadow-md')}>
          <svg className="w-1/2 h-1/2 text-background" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className={cn(s.icon, 'bg-gradient-to-br from-foreground to-muted-foreground rounded-lg flex items-center justify-center shadow-md')}>
          <svg className="w-1/2 h-1/2 text-background" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className={cn('font-display font-bold text-foreground', s.text)}>VMS</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(s.icon, 'bg-gradient-to-br from-foreground to-muted-foreground rounded-xl flex items-center justify-center shadow-lg')}>
        <svg className="w-1/2 h-1/2 text-background" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div className={cn('font-display font-bold text-foreground leading-tight', s.text)}>
          Vendor<span className="text-primary">Portal</span>
        </div>
        <div className={cn('font-body text-muted-foreground font-medium tracking-wide', s.subtext)}>
          Enterprise Management
        </div>
      </div>
    </div>
  );
};
