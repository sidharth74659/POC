import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'mobile-full' | 'mobile-padded';
}

export function ResponsiveContainer({ 
  children, 
  className,
  variant = 'default' 
}: ResponsiveContainerProps) {
  const variants = {
    default: 'container py-6',
    'mobile-full': 'w-full px-4 py-4 lg:container lg:py-6',
    'mobile-padded': 'px-4 py-4 lg:container lg:py-6'
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
}

interface MobileStackProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
}

export function MobileStack({ 
  children, 
  className,
  spacing = 'md' 
}: MobileStackProps) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  };

  return (
    <div className={cn('flex flex-col', spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 }
}: ResponsiveGridProps) {
  const gridClasses = [
    cols.mobile === 1 ? 'grid-cols-1' : `grid-cols-${cols.mobile}`,
    cols.tablet && `md:grid-cols-${cols.tablet}`,
    cols.desktop && `lg:grid-cols-${cols.desktop}`
  ].filter(Boolean).join(' ');

  return (
    <div className={cn('grid gap-4', gridClasses, className)}>
      {children}
    </div>
  );
} 