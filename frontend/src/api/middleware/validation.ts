import { ValidationError } from '../../types';

export class ValidationMiddleware {
  static validateEmail(email: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format' });
    }
    
    return errors;
  }

  static validatePassword(password: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.push({ 
        field: 'password', 
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
      });
    }
    
    return errors;
  }

  static validateTenantRegistration(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    errors.push(...this.validateEmail(data.adminEmail));
    errors.push(...this.validatePassword(data.password));
    
    if (!data.tenantName) {
      errors.push({ field: 'tenantName', message: 'Tenant name is required' });
    } else if (data.tenantName.length < 2) {
      errors.push({ field: 'tenantName', message: 'Tenant name must be at least 2 characters' });
    }
    
    if (!data.subdomain) {
      errors.push({ field: 'subdomain', message: 'Subdomain is required' });
    } else if (!/^[a-z0-9-]+$/.test(data.subdomain)) {
      errors.push({ field: 'subdomain', message: 'Subdomain can only contain lowercase letters, numbers, and hyphens' });
    }
    
    if (!data.firstName) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    }
    
    if (!data.lastName) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    }
    
    return errors;
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Basic XSS prevention
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  }

  static validateOrderData(data: any): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!data.customerName) {
      errors.push({ field: 'customerName', message: 'Customer name is required' });
    }
    
    errors.push(...this.validateEmail(data.customerEmail));
    
    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      errors.push({ field: 'items', message: 'At least one item is required' });
    } else {
      data.items.forEach((item: any, index: number) => {
        if (!item.name) {
          errors.push({ field: `items[${index}].name`, message: 'Item name is required' });
        }
        if (!item.quantity || item.quantity <= 0) {
          errors.push({ field: `items[${index}].quantity`, message: 'Item quantity must be greater than 0' });
        }
        if (!item.price || item.price <= 0) {
          errors.push({ field: `items[${index}].price`, message: 'Item price must be greater than 0' });
        }
      });
    }
    
    return errors;
  }
}