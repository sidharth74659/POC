// Import types from shared schemas
import type {
  TOrder,
  TOrderItem,
  TOrderStatus,
  TOrderCreateRequest,
  TOrderUpdateRequest,
  TOrderFilters,
  TOrderResponse,
  TOrdersResponse,
  TOrderApiResponse,
  TOrdersApiResponse
} from '../../../../../shared-schemas-zod/dist';

// Re-export shared types for use in Angular components
export type IOrder = TOrder;
export type IOrderItem = TOrderItem;
export type OrderStatus = TOrderStatus;
export type IOrderCreateRequest = TOrderCreateRequest;
export type IOrderUpdateRequest = TOrderUpdateRequest;
export type IOrderFilters = TOrderFilters;
export type IOrderResponse = TOrderResponse;
export type IOrdersResponse = TOrdersResponse;
export type IOrderApiResponse = TOrderApiResponse;
export type IOrdersApiResponse = TOrdersApiResponse; 