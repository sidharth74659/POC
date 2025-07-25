export interface IOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  status: OrderStatus;
  total: number;
  currency: string;
  notes?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface IOrderCreateRequest {
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: Omit<IOrderItem, 'id' | 'totalPrice'>[];
  notes?: string;
}

export interface IOrderUpdateRequest {
  status?: OrderStatus;
  notes?: string;
}

export interface IOrderResponse {
  success: boolean;
  data?: IOrder;
  error?: string;
  message?: string;
}

export interface IOrdersResponse {
  success: boolean;
  data?: IOrder[];
  error?: string;
  message?: string;
}

export interface IOrderFilters {
  status?: OrderStatus;
  customerId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
} 