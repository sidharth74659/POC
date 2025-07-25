// Import shared schemas from the shared module
const {
  // Auth schemas
  LoginRequestSchema,
  LogoutRequestSchema,
  LoginResponseSchema,
  LogoutResponseSchema,
  MeResponseSchema,
  LoginApiResponseSchema,
  MeApiResponseSchema,

  // User schemas
  UserCreateRequestSchema,
  UserUpdateRequestSchema,
  UserIdParamSchema,
  UserResponseSchema,
  UsersResponseSchema,
  UserDeleteResponseSchema,
  UserApiResponseSchema,
  UsersApiResponseSchema,
  UserDeleteApiResponseSchema,

  // Tenant schemas
  TenantCreateRequestSchema,
  TenantUpdateRequestSchema,
  TenantResponseSchema,
  TenantCreateResponseSchema,
  TenantCheckResponseSchema,
  TenantApiResponseSchema,
  TenantCreateApiResponseSchema,
  TenantCheckApiResponseSchema,

  // Order schemas
  OrderCreateRequestSchema,
  OrderUpdateRequestSchema,
  OrderResponseSchema,
  OrdersResponseSchema,
  OrderApiResponseSchema,
  OrdersApiResponseSchema,
} = require('../../../shared-schemas-zod/dist');

module.exports = {
  // Auth schemas
  LoginRequestSchema,
  LogoutRequestSchema,
  LoginResponseSchema,
  LogoutResponseSchema,
  MeResponseSchema,
  LoginApiResponseSchema,
  MeApiResponseSchema,

  // User schemas
  UserCreateRequestSchema,
  UserUpdateRequestSchema,
  UserIdParamSchema,
  UserResponseSchema,
  UsersResponseSchema,
  UserDeleteResponseSchema,
  UserApiResponseSchema,
  UsersApiResponseSchema,
  UserDeleteApiResponseSchema,

  // Tenant schemas
  TenantCreateRequestSchema,
  TenantUpdateRequestSchema,
  TenantResponseSchema,
  TenantCreateResponseSchema,
  TenantCheckResponseSchema,
  TenantApiResponseSchema,
  TenantCreateApiResponseSchema,
  TenantCheckApiResponseSchema,

  // Order schemas
  OrderCreateRequestSchema,
  OrderUpdateRequestSchema,
  OrderResponseSchema,
  OrdersResponseSchema,
  OrderApiResponseSchema,
  OrdersApiResponseSchema,
};
