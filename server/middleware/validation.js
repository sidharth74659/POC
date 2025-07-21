/**
 * Validation middleware for API requests
 */

/**
 * Validate instruction processing request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateInstructionRequest = (req, res, next) => {
  const { text, language } = req.body;
  
  // Check if text is provided
  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Text field is required and must be a string'
    });
  }
  
  // Check if text is not empty
  if (text.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Text field cannot be empty'
    });
  }
  
  // Validate language if provided
  if (language && typeof language !== 'string') {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Language field must be a string'
    });
  }
  
  // Sanitize input
  req.body.text = text.trim();
  req.body.language = language || 'en';
  
  next();
};

/**
 * Validate API key in headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // For now, we'll allow requests without API key in development
  // In production, you would validate against a stored API key
  if (process.env.NODE_ENV === 'production' && !apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required'
    });
  }
  
  next();
};

/**
 * Sanitize input to prevent XSS
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const sanitizeInput = (req, res, next) => {
  if (req.body.text) {
    // Basic XSS prevention - remove script tags and dangerous characters
    req.body.text = req.body.text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  next();
};

module.exports = {
  validateInstructionRequest,
  validateApiKey,
  sanitizeInput
}; 