import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

import storageService from '../services/storageService';
import analyticsService from '../services/analyticsService';
import logger from '../utils/logger';

const URLRedirect = () => {
  const { shortcode } = useParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      logger.info('Processing redirect', { shortcode });

      try {
        const urlData = storageService.getURLByShortcode(shortcode);

        if (!urlData) {
          setStatus('notFound');
          logger.warn('Shortcode not found', { shortcode });
          return;
        }

        // Check if URL is expired
        if (new Date(urlData.expiresAt) <= new Date()) {
          setStatus('expired');
          logger.warn('URL expired', { shortcode });
          return;
        }

        // Track the click
        const clickData = await analyticsService.trackClick(shortcode);
        storageService.recordClick(shortcode, clickData);

        // Redirect to original URL
        logger.info('Redirecting to original URL', { shortcode, url: urlData.originalUrl });
        window.location.href = urlData.originalUrl;
      } catch (error) {
        logger.error('Redirect error', error);
        setError(error.message);
        setStatus('error');
      }
    };

    handleRedirect();
  }, [shortcode]);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'notFound') {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          URL Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The short URL you're looking for doesn't exist.
        </Typography>
      </Paper>
    );
  }

  if (status === 'expired') {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          URL Expired
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This short URL has expired and is no longer valid.
        </Typography>
      </Paper>
    );
  }

  if (status === 'error') {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error || 'An error occurred while processing your request.'}
        </Typography>
      </Paper>
    );
  }

  return <Navigate to="/" replace />;
};

export default URLRedirect;