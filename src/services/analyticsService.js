import logger from '../utils/logger';

class AnalyticsService {
  async getGeolocation() {
    try {
      // Simple geolocation API call (free tier)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        city: data.city || 'Unknown',
        region: data.region || 'Unknown',
        country: data.country_name || 'Unknown'
      };
    } catch (error) {
      logger.error('Failed to get geolocation', error);
      return {
        city: 'Unknown',
        region: 'Unknown',
        country: 'Unknown'
      };
    }
  }

  getClickSource() {
    const referrer = document.referrer;
    
    if (!referrer) return 'direct';
    
    try {
      const url = new URL(referrer);
      const hostname = url.hostname;
      
      // Detect common sources
      if (hostname.includes('google')) return 'google';
      if (hostname.includes('facebook')) return 'facebook';
      if (hostname.includes('twitter')) return 'twitter';
      if (hostname.includes('linkedin')) return 'linkedin';
      
      return hostname;
    } catch {
      return 'unknown';
    }
  }

  async trackClick(shortcode) {
    logger.info('Tracking click', { shortcode });
    
    const [location, source] = await Promise.all([
      this.getGeolocation(),
      this.getClickSource()
    ]);

    return {
      timestamp: new Date().toISOString(),
      source,
      location: `${location.city}, ${location.country}`,
      locationDetails: location
    };
  }
}

export default new AnalyticsService();