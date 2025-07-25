import { z } from 'zod';

// Base schemas
export const TenantSettingsSchema = z.object({
  theme: z.object({
    primaryColor: z.string().default('#3b82f6'),
    secondaryColor: z.string().default('#64748b'),
    logo: z.string().optional(),
  }),
  features: z.object({
    analytics: z.boolean().default(true),
    reporting: z.boolean().default(true),
    integrations: z.boolean().default(false),
  }),
  limits: z.object({
    maxUsers: z.number().default(10),
    maxOrders: z.number().default(1000),
    maxStorage: z.number().default(1024), // MB
  }),
});

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Company name is required'),
  subdomain: z.string().min(3, 'Subdomain must be at least 3 characters').max(63, 'Subdomain must be at most 63 characters'),
  domain: z.string(),
  isActive: z.boolean().default(true),
  settings: TenantSettingsSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const TenantCreateRequestSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  requestedSubdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(63, 'Subdomain must be at most 63 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .refine(val => !val.startsWith('-') && !val.endsWith('-'), 'Subdomain cannot start or end with hyphen')
    .refine(val => !val.includes('--'), 'Subdomain cannot contain consecutive hyphens'),
  adminEmail: z.string().email('Valid email is required'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
  settings: TenantSettingsSchema.optional(),
});

export const TenantUpdateRequestSchema = z.object({
  name: z.string().min(1, 'Company name is required').optional(),
  isActive: z.boolean().optional(),
  settings: TenantSettingsSchema.partial().optional(),
});

// Response schemas
export const TenantResponseSchema = TenantSchema.pick({
  id: true,
  name: true,
  subdomain: true,
  domain: true,
  isActive: true,
  settings: true,
  createdAt: true,
  updatedAt: true,
});

export const TenantsResponseSchema = z.array(TenantResponseSchema);

export const TenantCreateResponseSchema = z.object({
  message: z.string(),
});

export const TenantCheckResponseSchema = z.object({
  tenant: TenantResponseSchema.optional(),
});

// API Response wrapper schemas
export const TenantApiResponseSchema = z.object({
  success: z.boolean(),
  data: TenantResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const TenantCreateApiResponseSchema = z.object({
  success: z.boolean(),
  data: TenantCreateResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const TenantCheckApiResponseSchema = z.object({
  success: z.boolean(),
  data: TenantCheckResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const TenantsApiResponseSchema = z.object({
  success: z.boolean(),
  data: TenantsResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Type exports
export type TTenant = z.infer<typeof TenantSchema>;
export type TTenantSettings = z.infer<typeof TenantSettingsSchema>;
export type TTenantCreateRequest = z.infer<typeof TenantCreateRequestSchema>;
export type TTenantUpdateRequest = z.infer<typeof TenantUpdateRequestSchema>;
export type TTenantResponse = z.infer<typeof TenantResponseSchema>;
export type TTenantsResponse = z.infer<typeof TenantsResponseSchema>;
export type TTenantCreateResponse = z.infer<typeof TenantCreateResponseSchema>;
export type TTenantCheckResponse = z.infer<typeof TenantCheckResponseSchema>;
export type TTenantApiResponse = z.infer<typeof TenantApiResponseSchema>;
export type TTenantsApiResponse = z.infer<typeof TenantsApiResponseSchema>;
export type TTenantCreateApiResponse = z.infer<typeof TenantCreateApiResponseSchema>;
export type TTenantCheckApiResponse = z.infer<typeof TenantCheckApiResponseSchema>; 