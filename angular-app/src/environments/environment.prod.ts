const subdomain = window.location.hostname.split('.')[0];
const apiBaseUrl = `https://${subdomain}.hubnest.live/api`;

export const environment = {
  production: true,
  apiBaseUrl: apiBaseUrl,
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