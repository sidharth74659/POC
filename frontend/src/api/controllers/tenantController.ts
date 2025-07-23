import { ValidationMiddleware } from '../middleware/validation';
import { MockDatabase } from '../data/mockDatabase';
import { ApiResponse, Tenant } from '../../types';

// Mock Cloudflare service
class CloudflareService {
  static async createSubdomain(subdomain: string): Promise<{ zoneId: string; recordId: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      zoneId: `cf_zone_${Date.now()}`,
      recordId: `cf_record_${Date.now()}`
    };
  }
  
  static async deleteSubdomain(zoneId: string, recordId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Deleted Cloudflare record ${recordId} in zone ${zoneId}`);
  }
}

export class TenantController {
  static async registerTenant(data: {
    tenantName: string;
    subdomain: string;
    adminEmail: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<ApiResponse<{ tenant: Tenant; adminUser: any }>> {
    try {
      // Validate input
      const validationErrors = ValidationMiddleware.validateTenantRegistration(data);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: validationErrors.map(e => e.message).join(', ')
        };
      }
      
      // Sanitize input
      const sanitizedData = {
        tenantName: ValidationMiddleware.sanitizeInput(data.tenantName),
        subdomain: data.subdomain.toLowerCase(),
        adminEmail: data.adminEmail.toLowerCase(),
        password: data.password,
        firstName: ValidationMiddleware.sanitizeInput(data.firstName),
        lastName: ValidationMiddleware.sanitizeInput(data.lastName)
      };
      
      // Create Cloudflare subdomain (mocked)
      const cloudflareResult = await CloudflareService.createSubdomain(sanitizedData.subdomain);
      
      // Create tenant
      const tenant = await MockDatabase.createTenant({
        name: sanitizedData.tenantName,
        domain: `${sanitizedData.subdomain}.example.com`,
        subdomain: sanitizedData.subdomain,
        adminEmail: sanitizedData.adminEmail,
        isActive: true,
        cloudflareZoneId: cloudflareResult.zoneId,
        settings: {
          maxUsers: 50,
          features: ['users_management', 'orders']
        }
      });
      
      // Create admin user
      const adminUser = await MockDatabase.createUser({
        email: sanitizedData.adminEmail,
        password: sanitizedData.password,
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        role: 'admin',
        tenantId: tenant.id,
        isActive: true
      });
      
      return {
        success: true,
        data: {
          tenant,
          adminUser: { ...adminUser, password: undefined }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to register tenant'
      };
    }
  }
  
  static async getTenantBySubdomain(subdomain: string): Promise<ApiResponse<Tenant>> {
    try {
      const tenant = await MockDatabase.getTenantBySubdomain(subdomain);
      
      if (!tenant) {
        return { success: false, error: 'Tenant not found' };
      }
      
      return { success: true, data: tenant };
    } catch (error) {
      return { success: false, error: 'Failed to get tenant' };
    }
  }
}