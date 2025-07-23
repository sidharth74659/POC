export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  cloudflareZoneId?: string;
  settings: {
    maxUsers: number;
    features: string[];
  };
}

export interface Order {
  id: string;
  tenantId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresAt: Date;
  user: Omit<User, 'password'>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}