// Import types from shared schemas
import type {
  TTenant,
  TTenantSettings,
  TTenantCreateRequest,
  TTenantUpdateRequest,
  TTenantResponse,
  TTenantsResponse,
  TTenantApiResponse,
  TTenantsApiResponse,
  TTenantCreateApiResponse,
  TTenantCheckApiResponse
} from '@shared-schemas';

// Re-export shared types for use in Angular components
export type ITenant = TTenant;
export type ITenantSettings = TTenantSettings;
export type ITenantCreateRequest = TTenantCreateRequest;
export type ITenantUpdateRequest = TTenantUpdateRequest;
export type ITenantResponse = TTenantResponse;
export type ITenantsResponse = TTenantsResponse;
export type ITenantApiResponse = TTenantApiResponse;
export type ITenantsApiResponse = TTenantsApiResponse;
export type ITenantCreateApiResponse = TTenantCreateApiResponse;
export type ITenantCheckApiResponse = TTenantCheckApiResponse; 