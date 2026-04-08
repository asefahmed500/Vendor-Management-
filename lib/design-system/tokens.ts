/**
 * VMS PRO Design System Tokens
 *
 * Based on design-system/vms-pro/MASTER.md specifications
 * Style: Trust & Authority
 */

/**
 * Color Palette
 */
export const colors = {
  primary: '#7C3AED',
  secondary: '#A78BFA',
  cta: '#F97316',
  background: '#FAF5FF',
  text: '#4C1D95',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

/**
 * Spacing Variables
 */
export const spacing = {
  xs: '4px',   // 0.25rem
  sm: '8px',   // 0.5rem
  md: '16px',  // 1rem
  lg: '24px',  // 1.5rem
  xl: '32px',  // 2rem
  '2xl': '48px', // 3rem
  '3xl': '64px', // 4rem
} as const;

/**
 * Shadow Depths
 */
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.15)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
} as const;

/**
 * Border Radius
 */
export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  full: '9999px',
} as const;

/**
 * Font Sizes
 */
export const fontSize = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',    // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  '4xl': '2.5rem', // 40px
  '5xl': '3rem',   // 48px
} as const;

/**
 * Font Weights
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '900',
} as const;

/**
 * Z-index layers
 */
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

/**
 * Transition durations
 */
export const transition = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
} as const;

/**
 * CSS Variable Names
 */
export const cssVars = {
  colors: {
    primary: '--color-primary',
    secondary: '--color-secondary',
    cta: '--color-cta',
    background: '--color-background',
    text: '--color-text',
  },
  spacing: {
    xs: '--space-xs',
    sm: '--space-sm',
    md: '--space-md',
    lg: '--space-lg',
    xl: '--space-xl',
    '2xl': '--space-2xl',
    '3xl': '--space-3xl',
  },
  shadows: {
    sm: '--shadow-sm',
    md: '--shadow-md',
    lg: '--shadow-lg',
    xl: '--shadow-xl',
  },
} as const;

/**
 * Generate CSS variable string for inline styles
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(${name}, ${fallback})` : `var(${name})`;
}

/**
 * Button variants based on VMS PRO specs
 */
export const buttonVariants = {
  primary: {
    backgroundColor: colors.cta,
    color: colors.white,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.semibold,
    transition: `all ${transition.base} ease`,
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `2px solid ${colors.primary}`,
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    fontWeight: fontWeight.semibold,
    transition: `all ${transition.base} ease`,
  },
} as const;

/**
 * Card styles based on VMS PRO specs
 */
export const cardStyles = {
  backgroundColor: colors.background,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  boxShadow: shadows.md,
  transition: `all ${transition.base} ease`,
} as const;
