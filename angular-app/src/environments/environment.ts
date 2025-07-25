export const environment = {
  production: false,
  apiBaseUrl: 'https://hubnest.live/api',
  appName: 'Multi-Tenant SaaS',
  version: '1.0.0',
  defaultTenant: 'tenantb',
  features: {
    auth: true,
    tenants: true,
    users: true,
    orders: true,
    analytics: true
  }
}; 