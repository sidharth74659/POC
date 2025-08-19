import React from 'react';
import { Card as UI5Card, CardHeader } from '@ui5/webcomponents-react';
import clsx from 'clsx';
import './Card.css';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Card variant */
  variant?: CardVariant;
  /** Card header title */
  title?: string;
  /** Card header subtitle */
  subtitle?: string;
  /** Header action element */
  headerAction?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Click handler for the entire card */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether card is clickable (affects styling) */
  clickable?: boolean;
  /** Whether card content should have padding */
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  title,
  subtitle,
  headerAction,
  footer,
  onClick,
  className,
  clickable = false,
  noPadding = false,
}) => {
  const cardClasses = clsx(
    'ds-card',
    `ds-card--${variant}`,
    {
      'ds-card--clickable': clickable || onClick,
      'ds-card--no-padding': noPadding,
    },
    className
  );

  const hasHeader = title || subtitle || headerAction;

  return (
    <UI5Card
      className={cardClasses}
      onClick={onClick}
      header={
        hasHeader ? (
          <CardHeader
            titleText={title}
            subtitleText={subtitle}
            action={headerAction}
          />
        ) : undefined
      }
    >
      <div className="ds-card__content">
        {children}
      </div>
      {footer && (
        <div className="ds-card__footer">
          {footer}
        </div>
      )}
    </UI5Card>
  );
};