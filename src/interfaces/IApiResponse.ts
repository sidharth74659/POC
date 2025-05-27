export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: IApiError;
  meta?: IApiMeta;
}

export interface IApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  path?: string;
}

export interface IApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  meta: IApiMeta;
}

export interface IApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
} 