import { z } from 'zod';

// Base schemas
export const CustomerContactSchema = z.object({
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

export const CustomerSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  customerId: z.string(),
  name: z.string().min(1, 'Customer name is required'),
  contact: CustomerContactSchema,
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const CustomerCreateRequestSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  name: z.string().min(1, 'Customer name is required'),
  contact: CustomerContactSchema,
});

export const CustomerUpdateRequestSchema = z.object({
  name: z.string().min(1, 'Customer name is required').optional(),
  contact: CustomerContactSchema.optional(),
  isActive: z.boolean().optional(),
});

export const CustomerIdParamSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
});

// Response schemas
export const CustomerResponseSchema = CustomerSchema.pick({
  id: true,
  tenantId: true,
  customerId: true,
  name: true,
  contact: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export const CustomersResponseSchema = z.array(CustomerResponseSchema);

export const CustomerDeleteResponseSchema = z.object({
  message: z.string(),
});

// API Response wrapper schemas
export const CustomerApiResponseSchema = z.object({
  success: z.boolean(),
  data: CustomerResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const CustomersApiResponseSchema = z.object({
  success: z.boolean(),
  data: CustomersResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const CustomerDeleteApiResponseSchema = z.object({
  success: z.boolean(),
  data: CustomerDeleteResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Type exports
export type TCustomer = z.infer<typeof CustomerSchema>;
export type TCustomerContact = z.infer<typeof CustomerContactSchema>;
export type TCustomerCreateRequest = z.infer<typeof CustomerCreateRequestSchema>;
export type TCustomerUpdateRequest = z.infer<typeof CustomerUpdateRequestSchema>;
export type TCustomerIdParam = z.infer<typeof CustomerIdParamSchema>;
export type TCustomerResponse = z.infer<typeof CustomerResponseSchema>;
export type TCustomersResponse = z.infer<typeof CustomersResponseSchema>;
export type TCustomerDeleteResponse = z.infer<typeof CustomerDeleteResponseSchema>;
export type TCustomerApiResponse = z.infer<typeof CustomerApiResponseSchema>;
export type TCustomersApiResponse = z.infer<typeof CustomersApiResponseSchema>;
export type TCustomerDeleteApiResponse = z.infer<typeof CustomerDeleteApiResponseSchema>; 