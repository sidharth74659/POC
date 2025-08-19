export const breakpointTokens = {
  xs: '320px',   // Mobile portrait
  sm: '480px',   // Mobile landscape
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape / Small desktop
  xl: '1280px',  // Desktop
  '2xl': '1536px', // Large desktop
};

export const mediaQueries = {
  xs: `(min-width: ${breakpointTokens.xs})`,
  sm: `(min-width: ${breakpointTokens.sm})`,
  md: `(min-width: ${breakpointTokens.md})`,
  lg: `(min-width: ${breakpointTokens.lg})`,
  xl: `(min-width: ${breakpointTokens.xl})`,
  '2xl': `(min-width: ${breakpointTokens['2xl']})`,
};