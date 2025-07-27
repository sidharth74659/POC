import { z } from 'zod';

// Base schemas for common patterns
export const BaseEntitySchema = z.object({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Tenant Schema
export const TenantSchema = BaseEntitySchema.extend({
  name: z.string().min(1, 'Tenant name is required'),
  subdomain: z.string().min(1, 'Subdomain is required').toLowerCase(),
  dbUri: z.string().min(1, 'Database URI is required'),
  isActive: z.boolean().default(true),
});

export type Tenant = z.infer<typeof TenantSchema>;

// User Schema
export const UserRoleSchema = z.enum(['admin', 'agent', 'customer']);
export const UserSchema = BaseEntitySchema.extend({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  email: z.string().email('Invalid email format'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  roles: z.array(UserRoleSchema).min(1, 'At least one role is required'),
});

export type User = z.infer<typeof UserSchema>;

// Address Schema
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

export type Address = z.infer<typeof AddressSchema>;

// Contact Schema
export const ContactSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

// Customer Schema
export const CustomerSchema = BaseEntitySchema.extend({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  name: z.string().min(1, 'Customer name is required').trim(),
  contact: ContactSchema,
  isActive: z.boolean().default(true),
});

export type Customer = z.infer<typeof CustomerSchema>;

// Order Status Schema
export const OrderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

// Order Details Schema
export const OrderDetailsSchema = z.object({
  product: z.string().min(1, 'Product name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  notes: z.string().optional(),
});

export type OrderDetails = z.infer<typeof OrderDetailsSchema>;

// Order Schema
export const OrderSchema = BaseEntitySchema.extend({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  details: OrderDetailsSchema,
  status: OrderStatusSchema.default('pending'),
});

export type Order = z.infer<typeof OrderSchema>;

// Request/Response schemas for API endpoints
export const CreateCustomerRequestSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  contact: ContactSchema,
});

export type CreateCustomerRequest = z.infer<typeof CreateCustomerRequestSchema>;

export const UpdateCustomerRequestSchema =
  CreateCustomerRequestSchema.partial();

export type UpdateCustomerRequest = z.infer<typeof UpdateCustomerRequestSchema>;

export const CreateOrderRequestSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  details: OrderDetailsSchema,
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;

export const UpdateOrderRequestSchema = z.object({
  status: OrderStatusSchema.optional(),
  details: OrderDetailsSchema.partial().optional(),
});

export type UpdateOrderRequest = z.infer<typeof UpdateOrderRequestSchema>;

// Authentication schemas
export const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// Tenant registration schema
export const TenantRegistrationSchema = z.object({
  name: z.string().min(1, 'Tenant name is required'),
  subdomain: z.string().min(1, 'Subdomain is required').toLowerCase(),
  adminEmail: z.string().email('Invalid admin email format'),
  adminPassword: z
    .string()
    .min(6, 'Admin password must be at least 6 characters'),
});

export type TenantRegistration = z.infer<typeof TenantRegistrationSchema>;

// Query parameter schemas
export const PaginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const CustomerQuerySchema = PaginationSchema.extend({
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
});

export type CustomerQuery = z.infer<typeof CustomerQuerySchema>;

export const OrderQuerySchema = PaginationSchema.extend({
  customerId: z.string().optional(),
  status: OrderStatusSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type OrderQuery = z.infer<typeof OrderQuerySchema>;

// Response schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T,
) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    }),
    message: z.string().optional(),
  });

// Export commonly used response types
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
};
