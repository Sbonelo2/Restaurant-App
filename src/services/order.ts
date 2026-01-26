// Order Management Service

import { Order, OrderItem } from '../store/ordersSlice';

export interface OrderRequest {
  userId: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: 'card' | 'cash' | 'wallet';
  specialInstructions?: string;
}

export interface OrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
  message?: string;
}

class OrderService {
  // Mock database
  private orders: Map<string, Order> = new Map();

  // Create a new order
  async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    try {
      console.log('Creating order:', orderRequest);

      const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      const newOrder: Order = {
        id: orderId,
        userId: orderRequest.userId,
        userName: orderRequest.userName,
        items: orderRequest.items,
        status: 'pending',
        subtotal: orderRequest.subtotal,
        tax: orderRequest.tax,
        deliveryFee: orderRequest.deliveryFee,
        total: orderRequest.total,
        deliveryAddress: orderRequest.deliveryAddress,
        orderDate: new Date().toISOString(),
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60000).toISOString(),
        paymentMethod: orderRequest.paymentMethod,
      };

      // Store order in mock database
      this.orders.set(orderId, newOrder);

      // Save to localStorage (for persistence in React Native, use AsyncStorage)
      await this.saveOrdersToStorage();

      return {
        success: true,
        order: newOrder,
        message: `Order ${orderId} created successfully`,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: 'Failed to create order',
      };
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const order = this.orders.get(orderId);

      if (!order) {
        return {
          success: false,
          error: `Order ${orderId} not found`,
        };
      }

      return {
        success: true,
        order,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: 'Failed to fetch order',
      };
    }
  }

  // Get all orders for a user
  async getUserOrders(userId: string): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const userOrders = Array.from(this.orders.values()).filter(order => order.userId === userId);
      return {
        success: true,
        orders: userOrders,
      };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return {
        success: false,
        error: 'Failed to fetch user orders',
      };
    }
  }

  // Get all orders (for admin)
  async getAllOrders(): Promise<{ success: boolean; orders?: Order[]; error?: string }> {
    try {
      const allOrders = Array.from(this.orders.values());
      return {
        success: true,
        orders: allOrders,
      };
    } catch (error) {
      console.error('Error fetching all orders:', error);
      return {
        success: false,
        error: 'Failed to fetch orders',
      };
    }
  }

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<OrderResponse> {
    try {
      const order = this.orders.get(orderId);

      if (!order) {
        return {
          success: false,
          error: `Order ${orderId} not found`,
        };
      }

      order.status = status;

      if (status === 'delivered') {
        order.actualDeliveryTime = new Date().toISOString();
      }

      this.orders.set(orderId, order);
      await this.saveOrdersToStorage();

      return {
        success: true,
        order,
        message: `Order ${orderId} status updated to ${status}`,
      };
    } catch (error) {
      console.error('Error updating order:', error);
      return {
        success: false,
        error: 'Failed to update order',
      };
    }
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    try {
      return await this.updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        error: 'Failed to cancel order',
      };
    }
  }

  // Get order statistics
  async getOrderStatistics(): Promise<{
    success: boolean;
    stats?: {
      totalOrders: number;
      totalRevenue: number;
      pendingOrders: number;
      deliveredOrders: number;
      cancelledOrders: number;
    };
    error?: string;
  }> {
    try {
      const allOrders = Array.from(this.orders.values());

      const stats = {
        totalOrders: allOrders.length,
        totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: allOrders.filter(order => order.status === 'pending').length,
        deliveredOrders: allOrders.filter(order => order.status === 'delivered').length,
        cancelledOrders: allOrders.filter(order => order.status === 'cancelled').length,
      };

      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        success: false,
        error: 'Failed to calculate statistics',
      };
    }
  }

  // Save orders to storage
  private async saveOrdersToStorage(): Promise<void> {
    try {
      // In a real app, save to Firebase or backend
      const ordersArray = Array.from(this.orders.entries());
      console.log('Saving orders to storage:', ordersArray.length);
      // localStorage would be: localStorage.setItem('orders', JSON.stringify(ordersArray));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  // Load orders from storage
  async loadOrdersFromStorage(): Promise<void> {
    try {
      // In a real app, load from Firebase or backend
      // const stored = localStorage.getItem('orders');
      // if (stored) {
      //   const ordersArray = JSON.parse(stored);
      //   this.orders = new Map(ordersArray);
      // }
      console.log('Orders loaded from storage');
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  // Clear all orders (for testing)
  async clearAllOrders(): Promise<void> {
    this.orders.clear();
    console.log('All orders cleared');
  }
}

// Export singleton instance
export const orderService = new OrderService();

export default orderService;
