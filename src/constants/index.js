export const CONSTANTS = {
    DEFAULT_VALIDITY_MINUTES: 30,
    MAX_URLS_PER_REQUEST: 5,
    MIN_SHORTCODE_LENGTH: 3,
    MAX_SHORTCODE_LENGTH: 20,
    SHORTCODE_PATTERN: /^[a-zA-Z0-9]+$/,
    URL_PATTERN: /^https?:\/\/.+/,
    
    STORAGE_KEYS: {
      URLS: 'shortened_urls',
      ANALYTICS: 'url_analytics',
      LOGS: 'app_logs'
    },
    
    ROUTES: {
      HOME: '/',
      STATISTICS: '/statistics',
      REDIRECT: '/:shortcode'
    },
    
    ERROR_MESSAGES: {
      INVALID_URL: 'Please enter a valid URL',
      INVALID_VALIDITY: 'Validity must be a positive number',
      INVALID_SHORTCODE: 'Shortcode must be alphanumeric and between 3-20 characters',
      SHORTCODE_EXISTS: 'This shortcode is already taken',
      URL_NOT_FOUND: 'The requested URL was not found',
      URL_EXPIRED: 'This URL has expired',
      GENERIC_ERROR: 'An error occurred. Please try again.'
    }
  };