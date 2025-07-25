import { z } from 'zod';

// Base schemas
export const UserRolesSchema = z.enum(['admin', 'agent', 'customer']);

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  roles: z.array(UserRolesSchema),
  tenantId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const LogoutRequestSchema = z.object({});

// Response schemas
export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema.pick({
    id: true,
    email: true,
    roles: true,
    tenantId: true,
  }),
});

export const LogoutResponseSchema = z.object({
  message: z.string(),
});

export const MeResponseSchema = z.object({
  user: UserSchema.pick({
    id: true,
    email: true,
    roles: true,
    tenantId: true,
  }),
});

// API Response wrapper schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const LoginApiResponseSchema = ApiResponseSchema(LoginResponseSchema);
export const MeApiResponseSchema = ApiResponseSchema(MeResponseSchema);

// Type exports
export type TUser = z.infer<typeof UserSchema>;
export type TLoginRequest = z.infer<typeof LoginRequestSchema>;
export type TLoginResponse = z.infer<typeof LoginResponseSchema>;
export type TLogoutRequest = z.infer<typeof LogoutRequestSchema>;
export type TLogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type TMeResponse = z.infer<typeof MeResponseSchema>;
export type TUserRoles = z.infer<typeof UserRolesSchema>;
export type TLoginApiResponse = z.infer<typeof LoginApiResponseSchema>;
export type TMeApiResponse = z.infer<typeof MeApiResponseSchema>; 