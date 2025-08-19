import React from 'react';
import clsx from 'clsx';
import './SkeletonLoader.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'button' | 'card' | 'table';

export interface SkeletonLoaderProps {
  /** Skeleton variant */
  variant?: SkeletonVariant;
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Number of lines for text variant */
  lines?: number;
  /** Additional CSS classes */
  className?: string;
  /** Custom animation duration */
  animationDuration?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width,
  height,
  lines = 3,
  className,
  animationDuration = '1.5s',
}) => {
  const skeletonClasses = clsx(
    'ds-skeleton',
    `ds-skeleton--${variant}`,
    className
  );

  const skeletonStyle: React.CSSProperties = {
    width,
    height,
    animationDuration,
  };

  if (variant === 'text') {
    return (
      <div className="ds-skeleton-text-container">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={clsx(skeletonClasses, {
              'ds-skeleton--text-last': index === lines - 1,
            })}
            style={{ ...skeletonStyle, width: index === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div
        className={skeletonClasses}
        style={{ ...skeletonStyle, width: width || '120px', height: height || '40px' }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className="ds-skeleton-card">
        <div className="ds-skeleton ds-skeleton--rectangular ds-skeleton-card__header" />
        <div className="ds-skeleton-card__content">
          <SkeletonLoader variant="text" lines={3} />
          <div className="ds-skeleton-card__actions">
            <SkeletonLoader variant="button" width="80px" />
            <SkeletonLoader variant="button" width="100px" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="ds-skeleton-table">
        <div className="ds-skeleton-table__header">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="ds-skeleton ds-skeleton--rectangular" />
          ))}
        </div>
        {Array.from({ length: 5 }, (_, rowIndex) => (
          <div key={rowIndex} className="ds-skeleton-table__row">
            {Array.from({ length: 4 }, (_, colIndex) => (
              <div key={colIndex} className="ds-skeleton ds-skeleton--rectangular" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={skeletonClasses} style={skeletonStyle} />
  );
};