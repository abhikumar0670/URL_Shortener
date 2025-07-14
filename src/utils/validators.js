import logger from './logger';

export const validateURL = (url) => {
  logger.debug('Validating URL', { url });
  
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }
    return { isValid: true };
  } catch (error) {
    logger.error('Invalid URL format', { url, error: error.message });
    return { isValid: false, error: 'Invalid URL format' };
  }
};

export const validateValidity = (validity) => {
  logger.debug('Validating validity period', { validity });
  
  if (validity === '' || validity === null || validity === undefined) {
    return { isValid: true, value: 30 }; // Default 30 minutes
  }

  const numValidity = Number(validity);
  if (isNaN(numValidity) || numValidity < 1) {
    return { isValid: false, error: 'Validity must be a positive number' };
  }

  return { isValid: true, value: Math.floor(numValidity) };
};

export const validateShortcode = (shortcode, existingShortcodes = []) => {
  logger.debug('Validating shortcode', { shortcode });
  
  if (!shortcode) {
    return { isValid: true }; // Optional field
  }

  if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
    return { isValid: false, error: 'Shortcode must be alphanumeric' };
  }

  if (shortcode.length < 3 || shortcode.length > 20) {
    return { isValid: false, error: 'Shortcode must be between 3 and 20 characters' };
  }

  if (existingShortcodes.includes(shortcode)) {
    return { isValid: false, error: 'Shortcode already exists' };
  }

  return { isValid: true };
};