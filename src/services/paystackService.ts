import { Alert } from "react-native";

// Paystack configuration
export const PAYSTACK_CONFIG = {
  // Test credentials
  test: {
    publicKey: "pk_test_1007d41beea87c548453d0f21b4d85a6f2e6fa85",
    baseUrl: "https://api.paystack.co",
  },
  // Production credentials (to be configured later)
  production: {
    publicKey: "", // Add your production public key
    baseUrl: "https://api.paystack.co",
  },
};

// Get current configuration (using test mode for development)
const getConfig = () => {
  return PAYSTACK_CONFIG.test;
};

// Initialize Paystack payment
export const initializePaystackPayment = async (
  email: string,
  amount: number,
  reference: string,
  metadata?: any
) => {
  try {
    const config = getConfig();
    
    // Paystack payment parameters
    const paymentData = {
      key: config.publicKey,
      email: email,
      amount: amount * 100, // Paystack expects amount in kobo (cents)
      reference: reference,
      currency: "ZAR",
      channels: ["card", "bank", "ussd", "qr"],
      metadata: metadata || {
        custom_fields: [
          {
            display_name: "Cart Items",
            variable_name: "cart_items",
            value: "Restaurant Order",
          },
        ],
      },
      callback: (response: any) => {
        console.log("Paystack callback:", response);
        if (response.status === "success") {
          Alert.alert(
            "Payment Successful",
            "Your payment has been processed successfully!",
            [{ text: "OK", onPress: () => console.log("Payment completed") }]
          );
        } else {
          Alert.alert(
            "Payment Failed",
            "Your payment could not be processed. Please try again.",
            [{ text: "OK", onPress: () => console.log("Payment failed") }]
          );
        }
      },
      onClose: () => {
        Alert.alert(
          "Payment Cancelled",
          "You have cancelled the payment process.",
          [{ text: "OK", onPress: () => console.log("Payment cancelled") }]
        );
      },
    };

    // In a real implementation, you would integrate Paystack's React Native SDK here
    // For now, we'll simulate the payment process
    console.log("Initializing Paystack payment:", paymentData);
    
    return {
      success: true,
      reference,
      message: "Payment initialized successfully",
    };
  } catch (error) {
    console.error("Paystack payment error:", error);
    Alert.alert(
      "Payment Error",
      "An error occurred while processing your payment. Please try again.",
      [{ text: "OK" }]
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Verify payment (for server-side verification)
export const verifyPaystackPayment = async (reference: string) => {
  try {
    const config = getConfig();
    const response = await fetch(`${config.baseUrl}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.publicKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    
    if (data.status && data.data.status === "success") {
      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        message: data.message || "Payment verification failed",
      };
    }
  } catch (error) {
    console.error("Paystack verification error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
};

// Calculate Paystack fees (if applicable)
export const calculatePaystackFees = (amount: number) => {
  // Paystack charges 1.5% + ₦100 for local cards
  // For international cards, it's 1.5% + $100
  // Since we're dealing with ZAR, we'll use a flat rate
  const percentageFee = amount * 0.015; // 1.5%
  const flatFee = 2.50; // ZAR 2.50 flat fee
  const totalFee = percentageFee + flatFee;
  
  return {
    percentageFee,
    flatFee,
    totalFee,
    totalWithFees: amount + totalFee,
  };
};

export default {
  initializePaystackPayment,
  verifyPaystackPayment,
  calculatePaystackFees,
  PAYSTACK_CONFIG,
};
