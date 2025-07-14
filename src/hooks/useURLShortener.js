import { useState, useCallback } from 'react';
import storageService from '../services/storageService';
import { validateURL, validateValidity, validateShortcode } from '../utils/validators';
import { generateShortcode, createShortURL } from '../utils/urlGenerator';
import logger from '../utils/logger';

const useURLShortener = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shortenURL = useCallback(async (urlData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate URL
      const urlValidation = validateURL(urlData.url);
      if (!urlValidation.isValid) {
        throw new Error(urlValidation.error);
      }

      // Validate and set validity
      const validityValidation = validateValidity(urlData.validity);
      if (!validityValidation.isValid) {
        throw new Error(validityValidation.error);
      }
      const validity = validityValidation.value;

      // Handle shortcode
      let shortcode = urlData.shortcode;
      if (shortcode) {
        const shortcodeValidation = validateShortcode(
          shortcode,
          storageService.getAllShortcodes()
        );
        if (!shortcodeValidation.isValid) {
          throw new Error(shortcodeValidation.error);
        }
      } else {
        shortcode = generateShortcode(storageService.getAllShortcodes());
      }

      // Create and save URL
      const newUrl = {
        originalUrl: urlData.url,
        shortcode,
        validity,
        shortUrl: createShortURL(shortcode)
      };

      const savedUrl = storageService.saveURL(newUrl);
      logger.info('URL shortened successfully', { shortcode });

      return savedUrl;
    } catch (err) {
      logger.error('Failed to shorten URL', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { shortenURL, loading, error };
};

export default useURLShortener;