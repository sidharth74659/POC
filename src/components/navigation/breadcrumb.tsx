import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  onHomeClick?: () => void;
}

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRight className="w-4 h-4" />,
  showHome = true,
  homeHref = '/',
  onHomeClick
}: BreadcrumbProps) {
  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick();
    } else if (homeHref) {
      window.location.href = homeHref;
    }
  };

  return (
    <nav 
      className={cn('flex items-center space-x-2 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {showHome && (
          <li>
            <button
              onClick={handleHomeClick}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          </li>
        )}
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {(showHome || index > 0) && (
              <li className="text-muted-foreground" aria-hidden="true">
                {separator}
              </li>
            )}
            <li>
              {item.isActive ? (
                <span 
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </button>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Breadcrumb with custom separator
export function BreadcrumbWithSlash({ items, className, ...props }: Omit<BreadcrumbProps, 'separator'>) {
  return (
    <Breadcrumb
      items={items}
      className={className}
      separator={<span className="text-muted-foreground">/</span>}
      {...props}
    />
  );
}

// Breadcrumb for project navigation
interface ProjectBreadcrumbProps {
  projectName?: string;
  tileName?: string;
  issueNumber?: string;
  onProjectClick?: () => void;
  onTileClick?: () => void;
  onHomeClick?: () => void;
  className?: string;
}

export function ProjectBreadcrumb({
  projectName,
  tileName,
  issueNumber,
  onProjectClick,
  onTileClick,
  onHomeClick,
  className
}: ProjectBreadcrumbProps) {
  const items: BreadcrumbItem[] = [];

  if (projectName) {
    items.push({
      label: projectName,
      onClick: onProjectClick,
      isActive: !tileName && !issueNumber
    });
  }

  if (tileName) {
    items.push({
      label: tileName,
      onClick: onTileClick,
      isActive: !issueNumber
    });
  }

  if (issueNumber) {
    items.push({
      label: issueNumber,
      isActive: true
    });
  }

  return (
    <BreadcrumbWithSlash
      items={items}
      className={className}
      onHomeClick={onHomeClick}
    />
  );
}

// Breadcrumb with loading state
interface LoadingBreadcrumbProps {
  isLoading: boolean;
  items: BreadcrumbItem[];
  className?: string;
}

export function LoadingBreadcrumb({ isLoading, items, className }: LoadingBreadcrumbProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center space-x-2 text-sm', className)}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-muted animate-pulse rounded" />
          <span className="text-muted-foreground">/</span>
          <div className="w-20 h-4 bg-muted animate-pulse rounded" />
          <span className="text-muted-foreground">/</span>
          <div className="w-16 h-4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  return <BreadcrumbWithSlash items={items} className={className} />;
} 