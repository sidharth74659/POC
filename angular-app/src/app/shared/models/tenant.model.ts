export interface ITenant {
  id: string;
  name: string;
  subdomain: string;
  domain: string;
  isActive: boolean;
  settings: ITenantSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITenantSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
  features: {
    analytics: boolean;
    reporting: boolean;
    integrations: boolean;
  };
  limits: {
    maxUsers: number;
    maxOrders: number;
    maxStorage: number;
  };
}

export interface ITenantCreateRequest {
  name: string;
  subdomain: string;
  adminEmail: string;
  adminPassword: string;
  settings?: Partial<ITenantSettings>;
}

export interface ITenantUpdateRequest {
  name?: string;
  isActive?: boolean;
  settings?: Partial<ITenantSettings>;
}

export interface ITenantResponse {
  success: boolean;
  data?: ITenant;
  error?: string;
  message?: string;
}

export interface ITenantsResponse {
  success: boolean;
  data?: ITenant[];
  error?: string;
  message?: string;
} 