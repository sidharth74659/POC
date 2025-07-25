export class TenantController {
  static async registerTenant(data: {
    tenantName: string;
    subdomain: string;
    adminEmail: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const res = await fetch('/api/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Registration failed' };
      return { success: true, data: result };
    } catch {
      return { success: false, error: 'Registration failed' };
    }
  }

  static async getTenantBySubdomain(subdomain: string) {
    try {
      const res = await fetch(`/api/tenants/check?subdomain=${encodeURIComponent(subdomain)}`);
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Tenant not found' };
      return { success: true, data: result.tenant };
    } catch {
      return { success: false, error: 'Failed to get tenant' };
    }
  }
}