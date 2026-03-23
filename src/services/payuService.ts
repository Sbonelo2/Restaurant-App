import { Alert } from "react-native";

// PayU South Africa configuration
export const PAYU_CONFIG = {
  // Sandbox (test) credentials
  sandbox: {
    merchantId: "10000001", // Test merchant ID
    merchantKey: "testKey123", // Test merchant key
    baseUrl: "https://secure.payu.co.za/eng/process",
    apiBaseUrl: "https://sandbox.payu.co.za/api",
  },
  // Production credentials (to be configured)
  production: {
    merchantId: "", // Add your production merchant ID
    merchantKey: "", // Add your production merchant key
    baseUrl: "https://secure.payu.co.za/eng/process",
    apiBaseUrl: "https://api.payu.co.za/api",
  },
};

export interface PayUPaymentData {
  // Merchant details
  merchantId: string;
  merchantKey: string;
  
  // Transaction details
  return_url: string;
  cancel_url: string;
  notify_url: string;
  
  // Payment details
  amount: number; // in cents
  item_name: string;
  item_description?: string;
  
  // Customer details
  email_address: string;
  name_first?: string;
  name_last?: string;
  
  // Transaction reference
  m_payment_id?: string;
  
  // Custom fields
  custom_str1?: string;
  custom_str2?: string;
  custom_int1?: string;
  custom_int2?: string;
  
  // Security
  signature?: string;
}

export class PayUService {
  private static isSandbox = true; // Set to false for production

  /**
   * Generate MD5 signature for PayU security
   */
  private static generateSignature(data: any): string {
    // PayU signature generation algorithm
    const sortedKeys = Object.keys(data)
      .filter(key => key !== 'signature' && data[key] !== '' && data[key] !== null)
      .sort();
    
    const paramString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');
    
    // Note: In production, use proper MD5 hash
    // return crypto.createMD5(paramString).toString();
    return "payu_demo_signature"; // Placeholder for demo
  }

  /**
   * Create PayU payment URL
   */
  static createPaymentUrl(paymentData: PayUPaymentData): string {
    const config = this.isSandbox ? PAYU_CONFIG.sandbox : PAYU_CONFIG.production;
    
    // Base payment data
    const data: any = {
      merchant_id: config.merchantId,
      merchant_key: config.merchantKey,
      ...paymentData,
      amount: paymentData.amount.toString(), // PayU requires string
    };

    // Generate signature
    const signature = this.generateSignature(data);
    data.signature = signature;

    // Build query string
    const queryString = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&');

    return `${config.baseUrl}?${queryString}`;
  }

  /**
   * Process payment (opens PayU payment page)
   */
  static async processPayment(paymentData: PayUPaymentData): Promise<void> {
    try {
      const paymentUrl = this.createPaymentUrl(paymentData);
      
      console.log("🚀 PayU Payment URL:", paymentUrl);
      
      // In a real React Native app, you would use:
      // - WebBrowser.openBrowserAsync(paymentUrl)
      // - Or Linking.openURL(paymentUrl)
      
      // For demo purposes, show simulation with proper async handling
      return new Promise<void>((resolve, reject) => {
        // Use minimal delay to ensure proper async handling
        setTimeout(() => {
          Alert.alert(
            "PayU South Africa Payment",
            `Processing payment with PayU:\n\nAmount: R${(paymentData.amount / 100).toFixed(2)}\nItem: ${paymentData.item_name}\nEmail: ${paymentData.email_address}\n\nThis is a demo simulation.`,
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => {
                  console.log("❌ Payment Cancelled");
                  reject(new Error("Payment cancelled by user"));
                }
              },
              {
                text: "Simulate Success",
                onPress: () => {
                  console.log("✅ Payment Simulation Success");
                  resolve();
                }
              }
            ],
            { cancelable: false }
          );
        }, 10); // Reduced delay for faster response
      });
    } catch (error) {
      console.error("PayU payment error:", error);
      throw error;
    }
  }

  /**
   * Verify PayU ITN callback
   */
  static verifyITNCallback(data: any): boolean {
    // In production, you would verify the signature
    // and check the payment status with PayU
    const signature = data.signature;
    const config = this.isSandbox ? PAYU_CONFIG.sandbox : PAYU_CONFIG.production;
    
    // Verify signature (simplified)
    const expectedSignature = this.generateSignature({
      ...data,
      merchant_id: config.merchantId,
      merchant_key: config.merchantKey,
    });
    
    return signature === expectedSignature;
  }

  /**
   * Get payment status from PayU
   */
  static async getPaymentStatus(paymentId: string): Promise<any> {
    // In production, you would make an API call to PayU
    // to check the payment status
    console.log("🔍 Checking PayU payment status for:", paymentId);
    
    // Mock response for demo
    return {
      status: "COMPLETE",
      payment_id: paymentId,
      amount: "10000", // R100.00 in cents
      merchant_reference: paymentId,
      payu_reference: `PAYU${Date.now()}`,
    };
  }

  /**
   * Create refund
   */
  static async createRefund(paymentId: string, amount: number): Promise<any> {
    console.log("💳 Creating PayU refund:", paymentId, amount);
    
    // Mock refund response
    return {
      refund_id: `REF${Date.now()}`,
      status: "PENDING",
      amount: amount.toString(),
    };
  }

  /**
   * Set sandbox mode (for testing)
   */
  static setSandboxMode(enabled: boolean): void {
    this.isSandbox = enabled;
  }

  /**
   * Get current environment
   */
  static isSandboxMode(): boolean {
    return this.isSandbox;
  }

  /**
   * Get PayU payment methods
   */
  static async getPaymentMethods(): Promise<any[]> {
    // Mock payment methods available in South Africa
    return [
      {
        id: "CREDIT_CARD",
        name: "Credit Card",
        description: "Visa, Mastercard, American Express",
        available: true,
      },
      {
        id: "DEBIT_CARD",
        name: "Debit Card",
        description: "Visa Debit, Mastercard Debit",
        available: true,
      },
      {
        id: "EFT",
        name: "Electronic Funds Transfer",
        description: "Instant EFT from South African banks",
        available: true,
      },
      {
        id: "MOBILE",
        name: "Mobile Payment",
        description: "Mobicred, Masterpass, Zapper",
        available: true,
      },
      {
        id: "CRYPTO",
        name: "Cryptocurrency",
        description: "Bitcoin, Ethereum payments",
        available: false, // Can be enabled
      },
    ];
  }

  /**
   * Calculate PayU fees
   */
  static calculateFees(amount: number): {
    gatewayFee: number;
    processingFee: number;
    totalFees: number;
    netAmount: number;
  } {
    // PayU South Africa typical fees
    const gatewayFee = Math.round(amount * 0.029); // 2.9% gateway fee
    const processingFee = 250; // R2.50 processing fee in cents
    const totalFees = gatewayFee + processingFee;
    const netAmount = amount - totalFees;

    return {
      gatewayFee,
      processingFee,
      totalFees,
      netAmount,
    };
  }
}

export default PayUService;
