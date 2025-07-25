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

export interface IUserCreateRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

export interface IUserUpdateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  isActive?: boolean;
}

export interface IUserResponse {
  success: boolean;
  data?: IUser;
  error?: string;
  message?: string;
}

export interface IUsersResponse {
  success: boolean;
  data?: IUser[];
  error?: string;
  message?: string;
} 