import { nanoid } from 'nanoid';
import logger from './logger';

export const generateShortcode = (existingShortcodes = []) => {
  logger.info('Generating new shortcode');
  
  let shortcode;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    shortcode = nanoid(8); // 8 character random string
    attempts++;
    
    if (attempts >= maxAttempts) {
      logger.error('Failed to generate unique shortcode', { attempts });
      throw new Error('Unable to generate unique shortcode');
    }
  } while (existingShortcodes.includes(shortcode));

  logger.info('Generated shortcode', { shortcode, attempts });
  return shortcode;
};

export const createShortURL = (shortcode) => {
  const baseURL = window.location.origin;
  return `${baseURL}/${shortcode}`;
};