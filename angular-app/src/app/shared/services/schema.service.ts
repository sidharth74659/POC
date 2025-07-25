import { Injectable } from '@angular/core';
import { z } from 'zod';
import {
  // Auth schemas
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutRequestSchema,
  LogoutResponseSchema,
  MeResponseSchema,
  UserSchema,
  UserRolesSchema,
  // User schemas
  UserCreateRequestSchema,
  UserUpdateRequestSchema,
  UserResponseSchema,
  UsersResponseSchema,
  // Tenant schemas
  TenantSchema,
  TenantSettingsSchema,
  TenantCreateRequestSchema,
  TenantUpdateRequestSchema,
  TenantResponseSchema,
  // Order schemas
  OrderSchema,
  OrderItemSchema,
  OrderStatusSchema,
  OrderCreateRequestSchema,
  OrderUpdateRequestSchema,
  OrderFiltersSchema,
  OrderResponseSchema,
  OrdersResponseSchema
} from '../../../../../shared-schemas-zod/dist';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  // Auth schemas
  readonly loginRequestSchema = LoginRequestSchema;
  readonly loginResponseSchema = LoginResponseSchema;
  readonly logoutRequestSchema = LogoutRequestSchema;
  readonly logoutResponseSchema = LogoutResponseSchema;
  readonly meResponseSchema = MeResponseSchema;
  readonly userSchema = UserSchema;
  readonly userRolesSchema = UserRolesSchema;

  // User schemas
  readonly userCreateRequestSchema = UserCreateRequestSchema;
  readonly userUpdateRequestSchema = UserUpdateRequestSchema;
  readonly userResponseSchema = UserResponseSchema;
  readonly usersResponseSchema = UsersResponseSchema;

  // Tenant schemas
  readonly tenantSchema = TenantSchema;
  readonly tenantSettingsSchema = TenantSettingsSchema;
  readonly tenantCreateRequestSchema = TenantCreateRequestSchema;
  readonly tenantUpdateRequestSchema = TenantUpdateRequestSchema;
  readonly tenantResponseSchema = TenantResponseSchema;

  // Order schemas
  readonly orderSchema = OrderSchema;
  readonly orderItemSchema = OrderItemSchema;
  readonly orderStatusSchema = OrderStatusSchema;
  readonly orderCreateRequestSchema = OrderCreateRequestSchema;
  readonly orderUpdateRequestSchema = OrderUpdateRequestSchema;
  readonly orderFiltersSchema = OrderFiltersSchema;
  readonly orderResponseSchema = OrderResponseSchema;
  readonly ordersResponseSchema = OrdersResponseSchema;

  /**
   * Validate data against a Zod schema
   */
  validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }

  /**
   * Safely validate data against a Zod schema
   */
  safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
    const result = schema.safeParse(data);
    return result;
  }

  /**
   * Validate form data and return validation errors
   */
  validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { isValid: boolean; errors: Record<string, string[]> } {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return { isValid: true, errors: {} };
    }

    const errors: Record<string, string[]> = {};
    result.error.errors.forEach((error: z.ZodIssue) => {
      const path = error.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(error.message);
    });

    return { isValid: false, errors };
  }

  /**
   * Get validation error messages for a specific field
   */
  getFieldErrors(errors: Record<string, string[]>, fieldName: string): string[] {
    return errors[fieldName] || [];
  }

  /**
   * Check if a field has validation errors
   */
  hasFieldError(errors: Record<string, string[]>, fieldName: string): boolean {
    return errors[fieldName] && errors[fieldName].length > 0;
  }
} 