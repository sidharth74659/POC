export { colorTokens, themeTokens } from './colors';
export { typographyTokens } from './typography';
export { spacingTokens, radiusTokens } from './spacing';
export { shadowTokens } from './shadows';
export { breakpointTokens, mediaQueries } from './breakpoints';

// Export all tokens as a single object for easier consumption
export const designTokens = {
  colors: colorTokens,
  themes: themeTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  radius: radiusTokens,
  shadows: shadowTokens,
  breakpoints: breakpointTokens,
  mediaQueries,
};