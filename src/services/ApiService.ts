import type { IApiResponse, IApiError, IApiRequestConfig } from '../interfaces';
import { CSRFProtection, globalRateLimiter } from '../utils/validation';

/**
 * ApiService - Centralized HTTP client with error handling, retries, caching, CSRF protection, and rate limiting
 */
export class ApiService {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor(baseURL: string = '/api', timeout: number = 10000, retries: number = 3) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultRetries = retries;
    this.cache = new Map();
    
    // Initialize CSRF protection
    CSRFProtection.initializeCSRF();
  }

  /**
   * Generic request method with retry logic, error handling, CSRF protection, and rate limiting
   */
  async request<T>(config: IApiRequestConfig): Promise<IApiResponse<T>> {
    const {
      method,
      url,
      data,
      params,
      headers = {},
      timeout = this.defaultTimeout,
      retries = this.defaultRetries
    } = config;

    // Rate limiting check
    const clientId = this.getClientIdentifier();
    if (!globalRateLimiter.isAllowed(clientId)) {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.',
          details: `Remaining requests: ${globalRateLimiter.getRemainingRequests(clientId)}`,
          timestamp: new Date(),
          path: this.buildUrl(url, params)
        }
      };
    }

    const fullUrl = this.buildUrl(url, params);
    const cacheKey = `${method}:${fullUrl}`;

    // Check cache for GET requests
    if (method === 'GET') {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: AbortSignal.timeout(timeout),
    };

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = CSRFProtection.getToken();
      if (csrfToken) {
        requestOptions.headers = {
          ...requestOptions.headers,
          'X-CSRF-Token': csrfToken
        };
      }
    }

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    let lastError: IApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions);
        
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response);
          lastError = errorData;
          
          // Don't retry for client errors (4xx) except 429 (rate limit)
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            break;
          }
          
          // Exponential backoff for retries
          if (attempt < retries) {
            await this.delay(Math.pow(2, attempt) * 1000);
            continue;
          }
        } else {
          const responseData = await response.json();
          
          // Cache successful GET requests
          if (method === 'GET') {
            this.setCache(cacheKey, responseData, 300000); // 5 minutes TTL
          }
          
          return { success: true, data: responseData };
        }
      } catch (error) {
        lastError = {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
          details: `Attempt ${attempt + 1} of ${retries + 1}`,
          timestamp: new Date(),
          path: this.buildUrl(url, params)
        };
        
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return {
      success: false,
      error: lastError || {
        code: 'UNKNOWN_ERROR',
        message: 'Request failed after all retry attempts',
        timestamp: new Date(),
        path: this.buildUrl(url, params)
      }
    };
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params, headers });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, headers });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, headers });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, headers });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, headers?: Record<string, string>): Promise<IApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, headers });
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, any>): string {
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
    
    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    return `${fullUrl}?${searchParams.toString()}`;
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getClientIdentifier(): string {
    // Implement your logic to get a unique client identifier based on the request
    // This is a placeholder and should be replaced with the actual implementation
    return 'default_client_identifier';
  }

  private parseErrorResponse(response: Response): IApiError {
    // Implement your logic to parse the error response from the API
    // This is a placeholder and should be replaced with the actual implementation
    return {
      code: response.status.toString(),
      message: response.statusText,
      details: {},
      timestamp: new Date(),
      path: response.url || '',
    };
  }
}

// Export singleton instance
export const apiService = new ApiService(); 