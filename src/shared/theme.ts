import { createTheme } from '@mui/material/styles';

export const reviewTheme = createTheme({
  shape: {
    borderRadius: 14,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#1f3a5f',
      dark: '#162942',
      light: '#34547f',
      contrastText: '#fcfbf8',
    },
    secondary: {
      main: '#65758b',
    },
    background: {
      default: '#f3f1ec',
      paper: '#fffefb',
    },
    text: {
      primary: '#16181d',
      secondary: '#616975',
    },
    divider: 'rgba(22, 24, 29, 0.1)',
  },
  typography: {
    fontFamily: '"IBM Plex Sans", sans-serif',
    h2: {
      fontSize: '1.1rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    button: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.72rem',
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
    overline: {
      fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.68rem',
      fontWeight: 500,
      letterSpacing: '0.12em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body, #root': {
          height: '100%',
        },
        body: {
          backgroundColor: '#f3f1ec',
        },
        '*': {
          boxSizing: 'border-box',
        },
        '::selection': {
          backgroundColor: 'rgba(31, 58, 95, 0.14)',
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(22, 24, 29, 0.1)',
          borderRadius: 10,
        },
      },
    },
  },
});
