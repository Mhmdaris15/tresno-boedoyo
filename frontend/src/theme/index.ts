import { createTheme } from '@mui/material/styles';

// Indonesia Heritage Society themed colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown - representing traditional Indonesian wood
      light: '#A0522D',
      dark: '#654321',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#CD7F32', // Bronze - representing traditional Indonesian metalwork
      light: '#DAA520',
      dark: '#B8860B',
      contrastText: '#ffffff',
    },
    success: {
      main: '#228B22', // Forest Green - representing Indonesian nature
      light: '#32CD32',
      dark: '#006400',
    },
    warning: {
      main: '#FF8C00', // Dark Orange - representing Indonesian sunset
      light: '#FFA500',
      dark: '#FF7F00',
    },
    error: {
      main: '#DC143C', // Crimson
      light: '#F08080',
      dark: '#B22222',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E2E2E',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;
