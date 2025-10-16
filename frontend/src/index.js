import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/plus-jakarta-sans/300.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={(theme) => ({
          '*': {
            boxSizing: 'border-box',
          },
          body: {
            margin: 0,
            minHeight: '100vh',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            scrollBehavior: 'smooth',
          },
          '#root': {
            minHeight: '100vh',
            position: 'relative',
            zIndex: 1,
          },
          'body::before': {
            content: '""',
            position: 'fixed',
            zIndex: 0,
            inset: '-25%',
            background:
              'radial-gradient(40% 50% at 20% 15%, rgba(124, 58, 237, 0.35) 0%, transparent 70%),' +
              'radial-gradient(45% 55% at 80% 10%, rgba(34, 211, 238, 0.28) 0%, transparent 72%),' +
              'radial-gradient(50% 70% at 50% 85%, rgba(236, 72, 153, 0.22) 0%, transparent 70%)',
            filter: 'blur(60px)',
            transform: 'translate3d(0, 0, 0)',
            animation: 'pulseGradient 18s ease-in-out infinite',
          },
          '@keyframes pulseGradient': {
            '0%': { transform: 'scale(1) translateY(0)' },
            '50%': { transform: 'scale(1.05) translateY(-2%)' },
            '100%': { transform: 'scale(1) translateY(0)' },
          },
          '::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(148, 163, 184, 0.35)',
            borderRadius: '999px',
          },
        })}
      />
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);