const logger = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'INFO',
      timestamp,
      message,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
  },

  error: (message, error = null, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'ERROR',
      timestamp,
      message,
      error: error ? {
        message: error.message,
        stack: error.stack
      } : null,
      ...meta
    };
    console.error(JSON.stringify(logEntry));
  },

  warn: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level: 'WARN',
      timestamp,
      message,
      ...meta
    };
    console.warn(JSON.stringify(logEntry));
  },

  request: (req, res, responseTime = null) => {
    const logEntry = {
      level: 'REQUEST',
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      tenantId: req.tenantId || 'N/A',
      userId: req.userId || 'N/A',
      statusCode: res.statusCode,
      responseTime: responseTime ? `${responseTime}ms` : null
    };
    console.log(JSON.stringify(logEntry));
  }
};

module.exports = logger;

