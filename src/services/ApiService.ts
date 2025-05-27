import type { IApiResponse, IApiError, IApiRequestConfig } from '../interfaces';

/**
 * ApiService - Centralized HTTP client with error handling, retries, and caching
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
  }

  /**
   * Generic request method with retry logic and error handling
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

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    let lastError: IApiError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          lastError = {
            code: response.status.toString(),
            message: errorData.message || response.statusText,
            details: errorData,
            timestamp: new Date(),
            path: fullUrl,
          };

          // Don't retry for client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            break;
          }

          // Wait before retry (exponential backoff)
          if (attempt < retries) {
            await this.delay(Math.pow(2, attempt) * 1000);
            continue;
          }
        }

        const result = await response.json();
        
        // Cache successful GET requests
        if (method === 'GET' && result.success) {
          this.setCache(cacheKey, result.data, 5 * 60 * 1000); // 5 minutes TTL
        }

        return result;
      } catch (error) {
        lastError = {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
          details: error,
          timestamp: new Date(),
          path: fullUrl,
        };

        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
          continue;
        }
      }
    }

    return {
      success: false,
      error: lastError!,
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
}

// Export singleton instance
export const apiService = new ApiService(); 