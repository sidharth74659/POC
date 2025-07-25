// Local type definitions for shared schemas
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface ILogoutRequest {
  // Empty interface for logout request
}

export interface ILogoutResponse {
  message: string;
}

export interface IMeResponse {
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  roles: string[];
  tenantId: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserRoles = 'admin' | 'agent' | 'customer';

// API Response wrapper interfaces
export interface ILoginApiResponse {
  success: boolean;
  data?: ILoginResponse;
  error?: string;
  message?: string;
}

export interface IMeApiResponse {
  success: boolean;
  data?: IMeResponse;
  error?: string;
  message?: string;
}

// Legacy interface for backward compatibility
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IValidateSessionResponse {
  success: boolean;
  data?: {
    user: IUser;
  };
  error?: string;
  message?: string;
} 