import logger from '../utils/logger';

const STORAGE_KEYS = {
  URLS: 'shortened_urls',
  ANALYTICS: 'url_analytics'
};

class StorageService {
  getURLs() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.URLS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error('Failed to retrieve URLs from storage', error);
      return [];
    }
  }

  saveURL(urlData) {
    try {
      const urls = this.getURLs();
      urls.push({
        ...urlData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + urlData.validity * 60 * 1000).toISOString(),
        clicks: 0
      });
      
      localStorage.setItem(STORAGE_KEYS.URLS, JSON.stringify(urls));
      logger.info('URL saved to storage', { shortcode: urlData.shortcode });
      return urls[urls.length - 1];
    } catch (error) {
      logger.error('Failed to save URL to storage', error);
      throw error;
    }
  }

  getURLByShortcode(shortcode) {
    const urls = this.getURLs();
    return urls.find(url => url.shortcode === shortcode);
  }

  isShortcodeExists(shortcode) {
    const urls = this.getURLs();
    return urls.some(url => url.shortcode === shortcode);
  }

  getAllShortcodes() {
    const urls = this.getURLs();
    return urls.map(url => url.shortcode);
  }

  recordClick(shortcode, clickData) {
    try {
      const analytics = this.getAnalytics();
      
      if (!analytics[shortcode]) {
        analytics[shortcode] = [];
      }

      analytics[shortcode].push({
        timestamp: new Date().toISOString(),
        source: clickData.source || 'direct',
        location: clickData.location || 'Unknown',
        ...clickData
      });

      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
      
      // Update click count in URLs
      const urls = this.getURLs();
      const urlIndex = urls.findIndex(url => url.shortcode === shortcode);
      if (urlIndex !== -1) {
        urls[urlIndex].clicks = (urls[urlIndex].clicks || 0) + 1;
        localStorage.setItem(STORAGE_KEYS.URLS, JSON.stringify(urls));
      }

      logger.info('Click recorded', { shortcode });
    } catch (error) {
      logger.error('Failed to record click', error);
    }
  }

  getAnalytics() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      logger.error('Failed to retrieve analytics', error);
      return {};
    }
  }

  getURLAnalytics(shortcode) {
    const analytics = this.getAnalytics();
    return analytics[shortcode] || [];
  }

  removeExpiredURLs() {
    try {
      const urls = this.getURLs();
      const now = new Date();
      const activeURLs = urls.filter(url => new Date(url.expiresAt) > now);
      
      localStorage.setItem(STORAGE_KEYS.URLS, JSON.stringify(activeURLs));
      logger.info('Expired URLs removed', { removed: urls.length - activeURLs.length });
    } catch (error) {
      logger.error('Failed to remove expired URLs', error);
    }
  }
}

export default new StorageService();