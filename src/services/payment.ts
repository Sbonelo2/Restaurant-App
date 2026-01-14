// Payment processing service
// This is a placeholder file for payment integration (Stripe, PayPal, etc.)

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'cash';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
  paymentMethodId?: string;
}

export interface OrderData {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shippingAddress: string;
  phoneNumber: string;
  specialInstructions?: string;
  status: string;
  createdAt: string;
}

// Mock payment processing
export const paymentService = {
  // Create payment intent
  createPaymentIntent: async (amount: number, currency: string = 'usd'): Promise<PaymentIntent> => {
    console.log(`Creating payment intent for ${amount} ${currency}`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock payment intent creation
        const paymentIntent: PaymentIntent = {
          id: `pi_${Date.now()}`,
          amount,
          currency,
          status: 'pending',
          clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        };
        
        // Simulate occasional failures
        if (Math.random() < 0.1) {
          reject(new Error('Payment processing failed'));
        } else {
          resolve(paymentIntent);
        }
      }, 1000);
    });
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId: string, paymentMethodId?: string): Promise<PaymentIntent> => {
    console.log(`Confirming payment: ${paymentIntentId}`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock payment confirmation
        const paymentIntent: PaymentIntent = {
          id: paymentIntentId,
          amount: 0, // Would be populated from actual payment intent
          currency: 'usd',
          status: Math.random() < 0.9 ? 'succeeded' : 'failed',
          paymentMethodId,
        };
        
        if (paymentIntent.status === 'failed') {
          reject(new Error('Payment confirmation failed'));
        } else {
          resolve(paymentIntent);
        }
      }, 1500);
    });
  },

  // Process order payment
  processPayment: async (orderData: OrderData): Promise<{ success: boolean; orderId: string; paymentId: string }> => {
    console.log('Processing payment for order:', orderData);
    
    try {
      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(orderData.total);
      
      // In a real app, you would:
      // 1. Show payment form to user
      // 2. Collect payment method details
      // 3. Confirm payment with the payment method
      
      // For mock purposes, we'll auto-confirm
      const confirmedPayment = await paymentService.confirmPayment(paymentIntent.id);
      
      if (confirmedPayment.status === 'succeeded') {
        // Save order to database (mock)
        const orderId = `order_${Date.now()}`;
        console.log(`Payment succeeded. Order ID: ${orderId}`);
        
        return {
          success: true,
          orderId,
          paymentId: confirmedPayment.id,
        };
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  // Get user's payment methods
  getPaymentMethods: async (userId: string): Promise<PaymentMethod[]> => {
    console.log(`Getting payment methods for user: ${userId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock payment methods
        const paymentMethods: PaymentMethod[] = [
          {
            id: 'pm_1',
            type: 'card',
            last4: '4242',
            brand: 'visa',
            expiryMonth: 12,
            expiryYear: 2024,
            isDefault: true,
          },
          {
            id: 'pm_2',
            type: 'card',
            last4: '5555',
            brand: 'mastercard',
            expiryMonth: 8,
            expiryYear: 2025,
            isDefault: false,
          },
          {
            id: 'pm_3',
            type: 'paypal',
            isDefault: false,
          },
        ];
        
        resolve(paymentMethods);
      }, 500);
    });
  },

  // Add new payment method
  addPaymentMethod: async (userId: string, paymentMethodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    console.log(`Adding payment method for user: ${userId}`, paymentMethodData);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock adding payment method
        const newPaymentMethod: PaymentMethod = {
          id: `pm_${Date.now()}`,
          type: paymentMethodData.type || 'card',
          last4: paymentMethodData.last4 || '1234',
          brand: paymentMethodData.brand || 'visa',
          expiryMonth: paymentMethodData.expiryMonth || 12,
          expiryYear: paymentMethodData.expiryYear || 2025,
          isDefault: false,
        };
        
        // Simulate occasional failures
        if (Math.random() < 0.1) {
          reject(new Error('Failed to add payment method'));
        } else {
          resolve(newPaymentMethod);
        }
      }, 1000);
    });
  },

  // Remove payment method
  removePaymentMethod: async (userId: string, paymentMethodId: string): Promise<boolean> => {
    console.log(`Removing payment method: ${paymentMethodId} for user: ${userId}`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate removal
        if (Math.random() < 0.1) {
          reject(new Error('Failed to remove payment method'));
        } else {
          resolve(true);
        }
      }, 500);
    });
  },

  // Set default payment method
  setDefaultPaymentMethod: async (userId: string, paymentMethodId: string): Promise<boolean> => {
    console.log(`Setting default payment method: ${paymentMethodId} for user: ${userId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  },

  // Process refund
  processRefund: async (paymentId: string, amount?: number): Promise<{ success: boolean; refundId: string }> => {
    console.log(`Processing refund for payment: ${paymentId}, amount: ${amount || 'full'}`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock refund processing
        if (Math.random() < 0.9) {
          resolve({
            success: true,
            refundId: `ref_${Date.now()}`,
          });
        } else {
          reject(new Error('Refund processing failed'));
        }
      }, 1000);
    });
  },
};

// Payment validation helpers
export const validateCard = (cardNumber: string, expiryMonth: number, expiryYear: number, cvv: string): boolean => {
  // Basic card validation (in production, use a proper validation library)
  const cardNumberRegex = /^\d{13,19}$/;
  const cvvRegex = /^\d{3,4}$/;
  
  if (!cardNumberRegex.test(cardNumber.replace(/\s/g, ''))) {
    return false;
  }
  
  if (!cvvRegex.test(cvv)) {
    return false;
  }
  
  const now = new Date();
  const expiryDate = new Date(expiryYear, expiryMonth - 1);
  
  if (expiryDate < now) {
    return false;
  }
  
  return true;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
};

export default paymentService;
