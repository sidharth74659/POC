/**
 * Comprehensive form validation and input sanitization utilities
 * Provides XSS prevention and robust validation
 */

// XSS Prevention - HTML sanitization
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick, onload, etc.
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, ''); // javascript: protocol
  sanitized = sanitized.replace(/\s*data\s*:/gi, ''); // data: protocol
  sanitized = sanitized.replace(/\s*vbscript\s*:/gi, ''); // vbscript: protocol
  
  // Remove dangerous tags
  const dangerousTags = ['script', 'object', 'embed', 'link', 'style', 'meta', 'iframe', 'frame', 'frameset'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized.trim();
}

// Input validation schemas
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitizedData: Record<string, any>;
}

// Comprehensive form validator
export class FormValidator {
  private schema: ValidationSchema;

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  validate(data: Record<string, any>): ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Record<string, any> = {};

    Object.keys(this.schema).forEach(field => {
      const rule = this.schema[field];
      const value = data[field];

      // Sanitize input first
      let sanitizedValue = value;
      if (typeof value === 'string') {
        sanitizedValue = sanitizeHtml(value);
      }
      sanitizedData[field] = sanitizedValue;

      // Required validation
      if (rule.required && (!sanitizedValue || sanitizedValue.toString().trim() === '')) {
        errors[field] = `${field} is required`;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!sanitizedValue && !rule.required) {
        return;
      }

      // Length validations
      if (rule.minLength && sanitizedValue.toString().length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        return;
      }

      if (rule.maxLength && sanitizedValue.toString().length > rule.maxLength) {
        errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        return;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(sanitizedValue.toString())) {
        errors[field] = `${field} format is invalid`;
        return;
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(sanitizedValue);
        if (customError) {
          errors[field] = customError;
          return;
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData
    };
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s\-_]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Pre-defined validation schemas
export const CommonSchemas = {
  issueForm: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
      pattern: ValidationPatterns.noSpecialChars
    },
    assignee: {
      required: true
    },
    priority: {
      required: true,
      custom: (value: string) => {
        const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
        return validPriorities.includes(value) ? null : 'Invalid priority level';
      }
    },
    content: {
      maxLength: 5000
    }
  },
  
  projectForm: {
    name: {
      required: true,
      minLength: 3,
      maxLength: 50,
      pattern: ValidationPatterns.noSpecialChars
    },
    purpose: {
      required: true,
      minLength: 10,
      maxLength: 200
    }
  },

  userForm: {
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: ValidationPatterns.alphanumeric
    },
    email: {
      required: true,
      pattern: ValidationPatterns.email
    },
    password: {
      required: true,
      pattern: ValidationPatterns.strongPassword,
      custom: (value: string) => {
        if (value.length < 8) return 'Password must be at least 8 characters';
        return null;
      }
    }
  }
};

// CSRF Token utilities
export class CSRFProtection {
  private static tokenKey = 'doctrack-csrf-token';

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    // Also set as meta tag for forms
    let metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = 'csrf-token';
      document.head.appendChild(metaTag);
    }
    metaTag.content = token;
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }

  static initializeCSRF(): string {
    let token = this.getToken();
    if (!token) {
      token = this.generateToken();
      this.setToken(token);
    }
    return token;
  }
}

// Rate limiting for API calls
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

export const globalRateLimiter = new RateLimiter(); 