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

export const OrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string().min(1, 'Product name is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerId: z.string(),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Valid email is required'),
  items: z.array(OrderItemSchema),
  status: OrderStatusSchema,
  total: z.number().positive('Total must be positive'),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  tenantId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request schemas
export const OrderCreateRequestSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantity: z.number().positive('Quantity must be positive'),
  price: z.number().positive('Price must be positive'),
});

export const OrderUpdateRequestSchema = z.object({
  status: OrderStatusSchema.optional(),
  notes: z.string().optional(),
});

export const OrderFiltersSchema = z.object({
  status: OrderStatusSchema.optional(),
  customerId: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().optional(),
});

// Response schemas
export const OrderResponseSchema = z.object({
  id: z.string(),
  product: z.string(),
  quantity: z.number(),
  price: z.number(),
  createdAt: z.date(),
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
export type TOrderItem = z.infer<typeof OrderItemSchema>;
export type TOrderStatus = z.infer<typeof OrderStatusSchema>;
export type TOrderCreateRequest = z.infer<typeof OrderCreateRequestSchema>;
export type TOrderUpdateRequest = z.infer<typeof OrderUpdateRequestSchema>;
export type TOrderFilters = z.infer<typeof OrderFiltersSchema>;
export type TOrderResponse = z.infer<typeof OrderResponseSchema>;
export type TOrdersResponse = z.infer<typeof OrdersResponseSchema>;
export type TOrderApiResponse = z.infer<typeof OrderApiResponseSchema>;
export type TOrdersApiResponse = z.infer<typeof OrdersApiResponseSchema>; 