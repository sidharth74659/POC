export class OrderController {
  static async getOrders(token: string, tenantId: string, page: number = 1, limit: number = 10) {
    try {
      const res = await fetch(`/api/orders?tenantId=${encodeURIComponent(tenantId)}&page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Failed to get orders', pagination: { page, limit, total: 0, totalPages: 0 } };
      return { success: true, data: result.orders, pagination: result.pagination };
    } catch {
      return { success: false, error: 'Failed to get orders', pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  }

  static async createOrder(token: string, tenantId: string, orderData: { customerName: string; customerEmail: string; items: Array<{ name: string; quantity: number; price: number; }>; }) {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...orderData, tenantId }),
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Failed to create order' };
      return { success: true, data: result.order };
    } catch {
      return { success: false, error: 'Failed to create order' };
    }
  }
}