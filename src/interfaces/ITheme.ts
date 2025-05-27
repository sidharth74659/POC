export type ThemeMode = 'light' | 'dark' | 'system';

export interface ITheme {
  mode: ThemeMode;
  colors: IThemeColors;
  spacing: IThemeSpacing;
  typography: IThemeTypography;
  shadows: IThemeShadows;
  borderRadius: IThemeBorderRadius;
}

export interface IThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export interface IThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface IThemeTypography {
  fontFamily: {
    sans: string[];
    mono: string[];
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
}

export interface IThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface IThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface IThemeContextValue {
  theme: ITheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
} 