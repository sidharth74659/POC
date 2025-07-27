import { Request } from 'express';

// Extend Express Request interface to include tenant and user
declare global {
  namespace Express {
    interface Request {
      tenant?: any;
      user?: any;
      tenantId?: string;
    }
  }
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  tenantId: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

// Database connection interface
export interface DatabaseConnection {
  uri: string;
  name: string;
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// API error interface
export interface APIError {
  message: string;
  statusCode: number;
  errors?: ValidationError[];
}

// Pagination interface
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

// Search options interface
export interface SearchOptions {
  search?: string;
  filters?: Record<string, any>;
  sort?: Record<string, 1 | -1>;
  pagination?: PaginationOptions;
}

// Tenant context interface
export interface TenantContext {
  tenantId: string;
  subdomain: string;
  dbUri: string;
}

// User context interface
export interface UserContext {
  userId: string;
  email: string;
  roles: string[];
  tenantId: string;
}

// Request context interface
export interface RequestContext {
  tenant: TenantContext;
  user: UserContext;
  requestId: string;
}

// Cloudflare tunnel interface
export interface CloudflareTunnel {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
}

// DNS record interface
export interface DNSRecord {
  id: string;
  name: string;
  type: 'A' | 'CNAME' | 'TXT';
  content: string;
  ttl: number;
  proxied: boolean;
}

// Environment variables interface
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  CLOUDFLARE_API_TOKEN: string;
  CLOUDFLARE_ZONE_ID: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_TUNNEL_SECRET: string;
}

// Log levels
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// HTTP methods
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Route handler function type
export type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void> | void;

// Middleware function type
export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void>;

// Database operation result
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

// Cache interface
export interface CacheOptions {
  ttl: number;
  key: string;
}

// Rate limiting interface
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

// Health check interface
export interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: Date;
  services: {
    database: boolean;
    redis?: boolean;
    external?: boolean;
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
}
