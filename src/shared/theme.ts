import { createTheme } from '@mui/material/styles';

export const reviewTheme = createTheme({
  shape: {
    borderRadius: 10,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#2d4a3e',
      dark: '#1b3228',
      light: '#3d6355',
      contrastText: '#faf8f4',
    },
    secondary: {
      main: '#8b5e3c',
      light: '#b07d58',
      dark: '#6b4427',
    },
    error: {
      main: '#a63d2f',
    },
    success: {
      main: '#3d6b52',
    },
    background: {
      default: '#f0ece4',
      paper: '#faf8f4',
    },
    text: {
      primary: '#1a1c19',
      secondary: '#5e6459',
    },
    divider: 'rgba(26, 28, 25, 0.1)',
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h2: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.7rem',
      fontWeight: 500,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
    overline: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.65rem',
      fontWeight: 500,
      letterSpacing: '0.1em',
    },
    caption: {
      fontSize: '0.78rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          height: '100%',
        },
        body: {
          backgroundColor: '#f0ece4',
          backgroundImage:
            'radial-gradient(circle at 0% 0%, rgba(45, 74, 62, 0.06) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(139, 94, 60, 0.04) 0%, transparent 50%)',
          backgroundAttachment: 'fixed',
        },
        '*': {
          boxSizing: 'border-box',
        },
        '::selection': {
          backgroundColor: 'rgba(45, 74, 62, 0.16)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '6px 14px',
          minWidth: 0,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: 'rgba(26, 28, 25, 0.14)',
          '&:hover': {
            borderColor: 'rgba(45, 74, 62, 0.4)',
            backgroundColor: 'rgba(45, 74, 62, 0.04)',
          },
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.68rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(26, 28, 25, 0.1)',
          transition: 'all 100ms ease',
          '&:hover': {
            borderColor: 'rgba(45, 74, 62, 0.3)',
            backgroundColor: 'rgba(45, 74, 62, 0.06)',
          },
        },
        sizeSmall: {
          padding: 5,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontFamily: '"IBM Plex Mono", monospace',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          height: 26,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: '1px solid rgba(26, 28, 25, 0.1)',
          boxShadow: '-8px 0 32px rgba(26, 28, 25, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            fontFamily: '"IBM Plex Sans", sans-serif',
            fontSize: '0.88rem',
          },
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1a1c19',
          fontSize: '0.72rem',
          fontFamily: '"IBM Plex Mono", monospace',
          letterSpacing: '0.02em',
          padding: '5px 10px',
          borderRadius: 6,
        },
        arrow: {
          color: '#1a1c19',
        },
      },
    },
  },
});
