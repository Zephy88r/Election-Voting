/**
 * Design System - Nepal Flag Inspired Theme
 * Professional color palette, typography, spacing, and design tokens
 */

export const theme = {
  // Nepal Flag Colors
  colors: {
    primary: '#DC143C',        // Crimson Red
    primaryDark: '#B01030',     // Darker red for hover states
    primaryLight: '#E63950',    // Lighter red for active states
    secondary: '#003893',       // Royal Blue
    secondaryDark: '#002A6B',   // Darker blue
    secondaryLight: '#0045B8',  // Lighter blue
    accent: '#FFFFFF',          // White
    background: '#F8F9FA',      // Light gray background
    surface: '#FFFFFF',         // Card/container background
    text: {
      primary: '#1A1A1A',      // Dark text
      secondary: '#666666',     // Medium gray text
      light: '#999999',         // Light gray text
      inverse: '#FFFFFF',       // White text for dark backgrounds
    },
    border: {
      default: '#E0E0E0',       // Light border
      focus: '#DC143C',         // Focus border (primary)
      error: '#E63950',         // Error border
      success: '#28A745',        // Success border
    },
    status: {
      success: '#28A745',
      error: '#DC143C',
      warning: '#FFC107',
      info: '#003893',
    },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      mono: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing System (8px base unit)
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // Transitions
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;
