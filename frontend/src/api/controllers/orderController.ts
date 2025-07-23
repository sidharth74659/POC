import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { MockDatabase } from '../data/mockDatabase';
import { ApiResponse, Order, PaginatedResponse } from '../../types';

export class OrderController {
  static async getOrders(
    token: string,
    tenantId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Order>> {
    try {
      const currentUser = AuthMiddleware.requireAuth(token);
      AuthMiddleware.requireTenant(currentUser, tenantId);
      
      let orders: Order[];
      
      if (currentUser.role === 'admin') {
        // Admins can see all orders in tenant
        orders = await MockDatabase.getOrdersByTenant(tenantId);
      } else {
        // Regular users can only see their own orders
        orders = await MockDatabase.getOrdersByUser(currentUser.id, tenantId);
      }
      
      const total = orders.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedOrders = orders
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(startIndex, endIndex);
      
      return {
        success: true,
        data: paginatedOrders,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get orders',
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }
  }
  
  static async createOrder(
    token: string,
    tenantId: string,
    orderData: {
      customerName: string;
      customerEmail: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
    }
  ): Promise<ApiResponse<Order>> {
    try {
      const currentUser = AuthMiddleware.requireAuth(token);
      AuthMiddleware.requireTenant(currentUser, tenantId);
      
      // Validate input
      const validationErrors = ValidationMiddleware.validateOrderData(orderData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: validationErrors.map(e => e.message).join(', ')
        };
      }
      
      // Calculate total
      const total = orderData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      
      // Sanitize data
      const sanitizedOrderData = {
        customerName: ValidationMiddleware.sanitizeInput(orderData.customerName),
        customerEmail: orderData.customerEmail.toLowerCase(),
        items: orderData.items.map((item, index) => ({
          id: `item-${Date.now()}-${index}`,
          name: ValidationMiddleware.sanitizeInput(item.name),
          quantity: item.quantity,
          price: item.price
        })),
        total,
        status: 'pending' as const,
        tenantId,
        userId: currentUser.id
      };
      
      const order = await MockDatabase.createOrder(sanitizedOrderData);
      
      return {
        success: true,
        data: order
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }
}