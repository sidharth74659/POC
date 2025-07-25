import { z } from 'zod';

// Base schemas
export const OrderStatusSchema = z.enum([
  'pending',
  'confirmed', 
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]);

export const OrderDetailsSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
  notes: z.string().optional(),
});

export const OrderSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  customerId: z.string(),
  orderId: z.string(),
  details: OrderDetailsSchema,
  status: OrderStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const OrderCreateRequestSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  details: OrderDetailsSchema,
});

export const OrderUpdateRequestSchema = z.object({
  status: OrderStatusSchema.optional(),
  details: OrderDetailsSchema.optional(),
});

export const OrderFiltersSchema = z.object({
  status: OrderStatusSchema.optional(),
  customerId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().optional(),
});

// Response schemas
export const OrderResponseSchema = OrderSchema.pick({
  id: true,
  tenantId: true,
  customerId: true,
  orderId: true,
  details: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const OrdersResponseSchema = z.array(OrderResponseSchema);

// API Response wrapper schemas
export const OrderApiResponseSchema = z.object({
  success: z.boolean(),
  data: OrderResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const OrdersApiResponseSchema = z.object({
  success: z.boolean(),
  data: OrdersResponseSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Type exports
export type TOrder = z.infer<typeof OrderSchema>;
export type TOrderDetails = z.infer<typeof OrderDetailsSchema>;
export type TOrderStatus = z.infer<typeof OrderStatusSchema>;
export type TOrderCreateRequest = z.infer<typeof OrderCreateRequestSchema>;
export type TOrderUpdateRequest = z.infer<typeof OrderUpdateRequestSchema>;
export type TOrderFilters = z.infer<typeof OrderFiltersSchema>;
export type TOrderResponse = z.infer<typeof OrderResponseSchema>;
export type TOrdersResponse = z.infer<typeof OrdersResponseSchema>;
export type TOrderApiResponse = z.infer<typeof OrderApiResponseSchema>;
export type TOrdersApiResponse = z.infer<typeof OrdersApiResponseSchema>; 