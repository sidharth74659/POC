import React from 'react';
import { Button as UI5Button } from '@ui5/webcomponents-react';
import ButtonDesign from '@ui5/webcomponents/dist/types/ButtonDesign.js';
import type { Ui5CustomEvent } from '@ui5/webcomponents-react/dist/types/Ui5CustomEvent.d.ts';
import type { ButtonDomRef } from '@ui5/webcomponents-react/dist/webComponents/Button/index.d.ts';
import type { ButtonClickEventDetail } from '@ui5/webcomponents/dist/Button.js';
import clsx from 'clsx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  /** Button content */
  children: React.ReactNode;
  /** Button variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Click handler */
  onClick?: (event: Ui5CustomEvent<ButtonDomRef, ButtonClickEventDetail>) => void;
  /** Additional CSS classes */
  className?: string;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Whether button should take full width */
  fullWidth?: boolean;
  /** ARIA label for accessibility */
  'aria-label'?: string;
}

const variantToDesignMap: Record<ButtonVariant, ButtonDesign> = {
  primary: ButtonDesign.Emphasized,
  secondary: ButtonDesign.Default,
  tertiary: ButtonDesign.Transparent,
  danger: ButtonDesign.Negative,
  ghost: ButtonDesign.Transparent,
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  className,
  icon,
  fullWidth = false,
  'aria-label': ariaLabel,
}) => {
  const buttonClasses = clsx(
    'ds-button',
    `ds-button--${variant}`,
    `ds-button--${size}`,
    {
      'ds-button--loading': loading,
      'ds-button--full-width': fullWidth,
      'ds-button--with-icon': icon,
    },
    className
  );

  return (
    <UI5Button
      design={variantToDesignMap[variant]}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      aria-label={ariaLabel}
      data-testid="ds-button"
    >
      {loading && (
        <div className="ds-button__spinner" role="status" aria-label="Loading">
          <div className="ds-spinner"></div>
        </div>
      )}
      {!loading && icon && <span className="ds-button__icon">{icon}</span>}
      <span className="ds-button__text">{children}</span>
    </UI5Button>
  );
};