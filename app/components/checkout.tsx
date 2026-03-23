import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

// Mock implementation for react-native-paystack-webview
const usePaystack = () => ({
  popup: {
    checkout: (options: any) => {
      // Mock payment success for development
      setTimeout(() => {
        if (options.onSuccess) {
          options.onSuccess({ transaction: 'mock_transaction_id' });
        }
      }, 1000);
    }
  }
});

interface CheckoutProps {
  email: string;
  totalAmount: number; // in Rand
  onSuccess: () => Promise<void>;
}

const Checkout: React.FC<CheckoutProps> = ({
  email,
  totalAmount,
  onSuccess,
}) => {
  const { popup } = usePaystack();

  const handlePay = () => {
    popup.checkout({
      email,
      amount: Math.round(totalAmount * 100), // 🔥 Paystack needs cents
      onSuccess: async (res: any) => {
        console.log("✅ Payment Success:", res);

        try {
          await onSuccess(); // 🔥 SAVE ORDER HERE
          Alert.alert("Payment Successful", "Your order has been placed!");
        } catch (err) {
          console.error("Order save failed:", err);
          Alert.alert("Error", "Payment succeeded but order save failed.");
        }
      },
      onCancel: () => {
        console.log("❌ Payment Cancelled");
        Alert.alert("Payment Cancelled", "Your payment was cancelled.");
      },
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePay}>
      <Text style={styles.buttonText}>Pay Now</Text>
    </TouchableOpacity>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ff6b00",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
