// Import types from shared schemas
import type {
  TUser,
  TUserCreateRequest,
  TUserUpdateRequest,
  TUserResponse,
  TUsersResponse,
  TUserApiResponse,
  TUsersApiResponse
} from '@shared-schemas';

// Re-export shared types for use in Angular components
export type IUser = TUser;
export type IUserCreateRequest = TUserCreateRequest;
export type IUserUpdateRequest = TUserUpdateRequest;
export type IUserResponse = TUserResponse;
export type IUsersResponse = TUsersResponse;
export type IUserApiResponse = TUserApiResponse;
export type IUsersApiResponse = TUsersApiResponse; 