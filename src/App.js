import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

import Header from './components/Layout/Header';
import URLShortenerForm from './components/URLShortener/URLShortenerForm';
import StatisticsPage from './components/Statistics/StatisticsPage';
import URLRedirect from './components/URLRedirect';
import ErrorBoundary from './components/Common/ErrorBoundary';

import storageService from './services/storageService';
import logger from './utils/logger';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  useEffect(() => {
    logger.info('Application started');
    
    // Clean up expired URLs on app start
    storageService.removeExpiredURLs();
    
    // Set up periodic cleanup
    const cleanupInterval = setInterval(() => {
      storageService.removeExpiredURLs();
    }, 60000); // Every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Header />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<URLShortenerForm />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/:shortcode" element={<URLRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;