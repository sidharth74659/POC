const hostname = window.location.hostname;
const apiBaseUrl = hostname === 'hubnest.live' 
  ? 'https://hubnest.live/api'
  : `https://${hostname.split('.')[0]}.hubnest.live/api`;

export const environment = {
  production: false,
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
