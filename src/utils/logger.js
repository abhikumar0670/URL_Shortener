class Logger {
    constructor() {
      // Assuming the logging middleware from pre-test setup is available
      this.middleware = window.LoggingMiddleware || this.fallbackLogger;
    }
  
    fallbackLogger = {
      log: (level, message, data) => {
        // Fallback implementation if middleware not available
        const timestamp = new Date().toISOString();
        const logEntry = {
          timestamp,
          level,
          message,
          data
        };
        
        // Store in localStorage for persistence
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        logs.push(logEntry);
        localStorage.setItem('app_logs', JSON.stringify(logs.slice(-1000))); // Keep last 1000 logs
      }
    };
  
    info(message, data = {}) {
      this.middleware.log('INFO', message, data);
    }
  
    error(message, error = {}) {
      this.middleware.log('ERROR', message, {
        error: error.message || error,
        stack: error.stack
      });
    }
  
    warn(message, data = {}) {
      this.middleware.log('WARN', message, data);
    }
  
    debug(message, data = {}) {
      this.middleware.log('DEBUG', message, data);
    }
  }
  
  export default new Logger();