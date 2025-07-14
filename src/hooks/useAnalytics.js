import { useState, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';
import logger from '../utils/logger';

const useAnalytics = (shortcode) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(() => {
    try {
      setLoading(true);
      const urlData = storageService.getURLByShortcode(shortcode);
      const clickData = storageService.getURLAnalytics(shortcode);

      if (!urlData) {
        throw new Error('URL not found');
      }

      setAnalytics({
        url: urlData,
        clicks: clickData
      });
    } catch (err) {
      logger.error('Failed to load analytics', { shortcode, error: err });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [shortcode]);

  useEffect(() => {
    if (shortcode) {
      loadAnalytics();
    }
  }, [shortcode, loadAnalytics]);

  return { analytics, loading, error, refresh: loadAnalytics };
};

export default useAnalytics;