import { createTheme, ThemeOptions } from '@mui/material/styles';

export const colors = {
  primary: '#2E8B57',      // Sea Green - represents heritage and nature
  secondary: '#CD853F',    // Peru - represents Indonesian earth tones
  accent: '#FF6347',       // Tomato - vibrant highlight color
  background: '#F8F9FA',   // Light gray background
  surface: '#FFFFFF',      // White surface
  text: '#212529',         // Dark text
  textSecondary: '#6C757D', // Gray text
  success: '#28A745',      // Green
  warning: '#FFC107',      // Yellow
  error: '#DC3545',        // Red
  info: '#17A2B8',         // Cyan
  
  // Heritage-inspired colors
  heritageGold: '#FFD700',
  heritageBronze: '#CD7F32',
  heritageRed: '#B22222',
  
  // Gradient colors
  gradientStart: '#2E8B57',
  gradientEnd: '#228B22',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (min-width:600px)': {
      fontSize: '2.5rem',
    },
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    '@media (min-width:600px)': {
      fontSize: '2rem',
    },
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
  },
};

export const theme: ThemeOptions = {
  palette: {
    primary: {
      main: colors.primary,
      light: '#4A9D6B',
      dark: '#1F5F3E',
    },
    secondary: {
      main: colors.secondary,
      light: '#D99A5F',
      dark: '#A0612C',
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    info: {
      main: colors.info,
    },
    success: {
      main: colors.success,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    body1: typography.body1,
    body2: typography.body2,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface,
          color: colors.text,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
};
