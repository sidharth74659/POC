import { Injectable } from '@angular/core';
import { z } from 'zod';
import {
  LoginRequestSchema,
  LoginResponseSchema,
  LoginApiResponseSchema,
  MeResponseSchema,
  MeApiResponseSchema,
  UserSchema,
  CustomerSchema,
  CustomerContactSchema,
  CustomerCreateRequestSchema,
  CustomerUpdateRequestSchema,
  CustomerResponseSchema,
  CustomerApiResponseSchema,
  OrderSchema,
  TenantSchema,
  TenantCreateRequestSchema,
  TenantCreateApiResponseSchema
} from '@shared-schemas';

@Injectable({
  providedIn: 'root'
})
export class SchemaService {
  // Auth schemas
  readonly loginRequestSchema = LoginRequestSchema;
  readonly loginResponseSchema = LoginResponseSchema;
  readonly loginApiResponseSchema = LoginApiResponseSchema;
  readonly meResponseSchema = MeResponseSchema;
  readonly meApiResponseSchema = MeApiResponseSchema;

  // User schemas
  readonly userSchema = UserSchema;

  // Customer schemas
  readonly customerSchema = CustomerSchema;
  readonly customerContactSchema = CustomerContactSchema;
  readonly customerCreateRequestSchema = CustomerCreateRequestSchema;
  readonly customerUpdateRequestSchema = CustomerUpdateRequestSchema;
  readonly customerResponseSchema = CustomerResponseSchema;
  readonly customerApiResponseSchema = CustomerApiResponseSchema;

  // Order schemas
  readonly orderSchema = OrderSchema;

  // Tenant schemas
  readonly tenantSchema = TenantSchema;
  readonly tenantCreateRequestSchema = TenantCreateRequestSchema;
  readonly tenantCreateApiResponseSchema = TenantCreateApiResponseSchema;

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