import { z } from 'zod';
import { UserSchema, UserRolesSchema } from './auth.schema';

// Request schemas
export const UserCreateRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  roles: z.array(UserRolesSchema).default(['customer']),
});

export const UserUpdateRequestSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  roles: z.array(UserRolesSchema).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const UserIdParamSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

// Response schemas
export const UserResponseSchema = UserSchema.pick({
  id: true,
  email: true,
  roles: true,
  firstName: true,
  lastName: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export const UsersResponseSchema = z.array(UserResponseSchema);

export const UserDeleteResponseSchema = z.object({
  message: z.string(),
});

// API Response wrapper schemas
export const UserApiResponseSchema = z.object({
  success: z.boolean(),
  data: UserResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const UsersApiResponseSchema = z.object({
  success: z.boolean(),
  data: UsersResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const UserDeleteApiResponseSchema = z.object({
  success: z.boolean(),
  data: UserDeleteResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Type exports
export type TUserCreateRequest = z.infer<typeof UserCreateRequestSchema>;
export type TUserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;
export type TUserIdParam = z.infer<typeof UserIdParamSchema>;
export type TUserResponse = z.infer<typeof UserResponseSchema>;
export type TUsersResponse = z.infer<typeof UsersResponseSchema>;
export type TUserDeleteResponse = z.infer<typeof UserDeleteResponseSchema>;
export type TUserApiResponse = z.infer<typeof UserApiResponseSchema>;
export type TUsersApiResponse = z.infer<typeof UsersApiResponseSchema>;
export type TUserDeleteApiResponse = z.infer<typeof UserDeleteApiResponseSchema>; 