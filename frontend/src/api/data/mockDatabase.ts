import { User, Tenant, Order } from '../../types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class MockDatabase {
  private static tenants = new Map<string, Tenant>();
  private static users = new Map<string, User>();
  private static orders = new Map<string, Order>();
  
  // Initialize with some sample data
  static {
    this.initializeSampleData();
  }
  
  private static async initializeSampleData() {
    // Create a sample tenant
    const sampleTenant: Tenant = {
      id: 'tenant-1',
      name: 'Acme Corporation',
      domain: 'acme-corp.example.com',
      subdomain: 'acme-corp',
      adminEmail: 'admin@acme-corp.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      cloudflareZoneId: 'cf_zone_123',
      settings: {
        maxUsers: 100,
        features: ['users_management', 'orders', 'analytics']
      }
    };
    
    this.tenants.set(sampleTenant.id, sampleTenant);
    
    // Create sample users
    const adminUser: User = {
      id: 'user-1',
      email: 'admin@acme-corp.com',
      password: await bcrypt.hash('Admin123!', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      tenantId: 'tenant-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    const regularUser: User = {
      id: 'user-2',
      email: 'user@acme-corp.com',
      password: await bcrypt.hash('User123!', 10),
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      tenantId: 'tenant-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(regularUser.id, regularUser);
    
    // Create sample orders
    const sampleOrder: Order = {
      id: 'order-1',
      tenantId: 'tenant-1',
      userId: 'user-2',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: [
        { id: 'item-1', name: 'Widget A', quantity: 2, price: 29.99 },
        { id: 'item-2', name: 'Widget B', quantity: 1, price: 49.99 }
      ],
      total: 109.97,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.orders.set(sampleOrder.id, sampleOrder);
  }
  
  // Tenant operations
  static async createTenant(tenantData: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant> {
    // Check if subdomain already exists
    const existingTenant = Array.from(this.tenants.values()).find(t => t.subdomain === tenantData.subdomain);
    if (existingTenant) {
      throw new Error('Subdomain already exists');
    }
    
    const tenant: Tenant = {
      ...tenantData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }
  
  static async getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    return Array.from(this.tenants.values()).find(t => t.subdomain === subdomain) || null;
  }
  
  // User operations
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    // Check if email already exists in tenant
    const existingUser = Array.from(this.users.values()).find(
      u => u.email === userData.email && u.tenantId === userData.tenantId
    );
    
    if (existingUser) {
      throw new Error('Email already exists in this tenant');
    }
    
    const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : undefined;
    
    const user: User = {
      ...userData,
      id: uuidv4(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(user.id, user);
    return user;
  }
  
  static async getUserByEmail(email: string, tenantId: string): Promise<User | null> {
    return Array.from(this.users.values()).find(
      u => u.email === email && u.tenantId === tenantId && u.isActive
    ) || null;
  }
  
  static async getUsersByTenant(tenantId: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.tenantId === tenantId && u.isActive);
  }
  
  static async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  static async deleteUser(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Soft delete
    const updatedUser = {
      ...user,
      isActive: false,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
  }
  
  // Order operations
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.orders.set(order.id, order);
    return order;
  }
  
  static async getOrdersByTenant(tenantId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(o => o.tenantId === tenantId);
  }
  
  static async getOrdersByUser(userId: string, tenantId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      o => o.userId === userId && o.tenantId === tenantId
    );
  }
}