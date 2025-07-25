// Import types from shared schemas
import type {
  TLoginRequest,
  TLoginResponse,
  TLogoutRequest,
  TLogoutResponse,
  TMeResponse,
  TUser,
  TUserRoles,
  TLoginApiResponse,
  TMeApiResponse
} from '../../../../../shared-schemas-zod/dist';

// Re-export shared types for use in Angular components
export type ILoginRequest = TLoginRequest;
export type ILoginResponse = TLoginResponse;
export type ILogoutRequest = TLogoutRequest;
export type ILogoutResponse = TLogoutResponse;
export type IMeResponse = TMeResponse;
export type IUser = TUser;
export type IUserRoles = TUserRoles;
export type ILoginApiResponse = TLoginApiResponse;
export type IMeApiResponse = TMeApiResponse;

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