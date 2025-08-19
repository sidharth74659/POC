export const colorTokens = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Secondary Colors
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Main secondary
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
};

export const themeTokens = {
  light: {
    // Backgrounds
    'bg-primary': colorTokens.neutral[50],
    'bg-secondary': colorTokens.neutral[100],
    'bg-tertiary': colorTokens.neutral[200],
    'bg-inverse': colorTokens.neutral[900],
    
    // Text colors
    'text-primary': colorTokens.neutral[900],
    'text-secondary': colorTokens.neutral[700],
    'text-tertiary': colorTokens.neutral[500],
    'text-inverse': colorTokens.neutral[50],
    'text-link': colorTokens.primary[600],
    
    // Border colors
    'border-primary': colorTokens.neutral[200],
    'border-secondary': colorTokens.neutral[300],
    'border-focus': colorTokens.primary[500],
    
    // Status colors
    'status-success': colorTokens.success[500],
    'status-warning': colorTokens.warning[500],
    'status-error': colorTokens.error[500],
    'status-info': colorTokens.primary[500],
  },
  
  dark: {
    // Backgrounds
    'bg-primary': colorTokens.neutral[950],
    'bg-secondary': colorTokens.neutral[900],
    'bg-tertiary': colorTokens.neutral[800],
    'bg-inverse': colorTokens.neutral[50],
    
    // Text colors
    'text-primary': colorTokens.neutral[50],
    'text-secondary': colorTokens.neutral[300],
    'text-tertiary': colorTokens.neutral[500],
    'text-inverse': colorTokens.neutral[900],
    'text-link': colorTokens.primary[400],
    
    // Border colors
    'border-primary': colorTokens.neutral[800],
    'border-secondary': colorTokens.neutral[700],
    'border-focus': colorTokens.primary[400],
    
    // Status colors
    'status-success': colorTokens.success[400],
    'status-warning': colorTokens.warning[400],
    'status-error': colorTokens.error[400],
    'status-info': colorTokens.primary[400],
  },
};