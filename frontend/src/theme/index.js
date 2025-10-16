import { createTheme, alpha } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      light: '#A855F7',
      dark: '#5B21B6'
    },
    secondary: {
      main: '#22D3EE',
      light: '#67E8F9',
      dark: '#0E7490'
    },
    background: {
      default: '#040B1A',
      paper: 'rgba(10, 17, 39, 0.85)'
    },
    text: {
      primary: '#F8FAFC',
      secondary: alpha('#E2E8F0', 0.72)
    },
    success: {
      main: '#34D399'
    },
    warning: {
      main: '#FBBF24'
    },
    error: {
      main: '#F87171'
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.02em'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.4rem',
      letterSpacing: '-0.015em'
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.6rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.3rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.05rem'
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0.01em'
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.04em'
    }
  },
  shape: {
    borderRadius: 18
  }
});

baseTheme.shadows[1] = `0px 18px 35px ${alpha(baseTheme.palette.primary.main, 0.18)}`;
baseTheme.shadows[2] = `0px 20px 45px ${alpha(baseTheme.palette.secondary.main, 0.16)}`;
baseTheme.shadows[3] = `0px 22px 50px ${alpha('#000', 0.28)}`;

baseTheme.components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: baseTheme.palette.background.default
      }
    }
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: baseTheme.shape.borderRadius,
        border: `1px solid ${alpha('#FFFFFF', 0.06)}`,
        backdropFilter: 'blur(18px)',
        boxShadow: baseTheme.shadows[1]
      }
    }
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: alpha('#0f172a', 0.65),
        backdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${alpha('#94A3B8', 0.18)}`,
        boxShadow: 'none'
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        textTransform: 'none',
        paddingInline: '1.6rem',
        paddingBlock: '0.65rem',
        fontWeight: 600
      },
      containedPrimary: {
        boxShadow: `0 20px 40px ${alpha(baseTheme.palette.primary.main, 0.35)}`,
        backgroundImage: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)'
      },
      containedSecondary: {
        boxShadow: `0 18px 32px ${alpha(baseTheme.palette.secondary.main, 0.35)}`,
        backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)'
      }
    }
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: alpha('#0F172A', 0.75),
        border: `1px solid ${alpha('#FFFFFF', 0.05)}`,
        boxShadow: baseTheme.shadows[2]
      }
    }
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined'
    },
    styleOverrides: {
      root: {
        backgroundColor: alpha('#020617', 0.55),
        borderRadius: baseTheme.shape.borderRadius
      }
    }
  },
  MuiOutlinedInput: {
    styleOverrides: {
      notchedOutline: {
        borderColor: alpha('#E2E8F0', 0.16)
      },
      root: {
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: alpha(baseTheme.palette.secondary.main, 0.4)
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: baseTheme.palette.secondary.main,
          borderWidth: 1.4
        }
      }
    }
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundColor: alpha('#0F172A', 0.45),
        '&:hover': {
          backgroundColor: alpha('#22D3EE', 0.18)
        }
      }
    }
  }
};

export default baseTheme;
