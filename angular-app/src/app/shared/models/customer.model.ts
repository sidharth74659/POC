// Import types from shared schemas
import type {
  TCustomer,
  TCustomerContact,
  TCustomerCreateRequest,
  TCustomerUpdateRequest,
  TCustomerIdParam,
  TCustomerResponse,
  TCustomersResponse,
  TCustomerDeleteResponse,
  TCustomerApiResponse,
  TCustomersApiResponse,
  TCustomerDeleteApiResponse
} from '../../../../../shared-schemas-zod/dist';

// Re-export shared types for use in Angular components
export type ICustomer = TCustomer;
export type ICustomerContact = TCustomerContact;
export type ICustomerCreateRequest = TCustomerCreateRequest;
export type ICustomerUpdateRequest = TCustomerUpdateRequest;
export type ICustomerIdParam = TCustomerIdParam;
export type ICustomerResponse = TCustomerResponse;
export type ICustomersResponse = TCustomersResponse;
export type ICustomerDeleteResponse = TCustomerDeleteResponse;
export type ICustomerApiResponse = TCustomerApiResponse;
export type ICustomersApiResponse = TCustomersApiResponse;
export type ICustomerDeleteApiResponse = TCustomerDeleteApiResponse; 