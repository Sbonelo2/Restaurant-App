import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../src/constants";
import PaystackService from "../../src/services/paystackService";

// Paystack payment implementation
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
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handlePaystackPayment = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    console.log("🔥 Paystack button clicked!");
    console.log("Email:", email);
    console.log("Amount:", totalAmount);
    
    setIsProcessing(true);
    
    try {
      // Generate unique transaction reference
      const reference = `KOM${Date.now()}`;
      
      // Calculate fees
      const fees = PaystackService.calculatePaystackFees(totalAmount);

      console.log("🚀 Initiating Paystack payment with reference:", reference);
      console.log("💳 Payment fees:", fees);

      // Initialize Paystack payment
      const result = await PaystackService.initializePaystackPayment(
        email,
        totalAmount,
        reference,
        {
          order_id: reference,
          restaurant: "KomEat",
          amount: totalAmount,
          fees: fees.totalFee,
        }
      );

      if (result.success) {
        console.log("✅ Paystack payment initiated successfully");
        
        Alert.alert(
          "Payment Successful", 
          `Your order has been placed!\n\nTransaction Reference: ${reference}\nAmount: R ${totalAmount.toFixed(2)}\nPayment Method: Paystack\n\nFees: R ${fees.totalFee.toFixed(2)}\nTotal Paid: R ${fees.totalWithFees.toFixed(2)}`
        );
        
        await onSuccess();
      } else {
        console.error("❌ Paystack payment failed:", result.error);
        Alert.alert(
          "Payment Failed",
          result.error || "Payment could not be processed. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("❌ Paystack payment error:", error);
      Alert.alert(
        "Payment Error",
        "An error occurred while processing your payment. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  console.log("🔥 Checkout component rendering with Paystack");
  
  return (
    <TouchableOpacity 
      style={[styles.button, isProcessing && styles.buttonDisabled]} 
      onPress={handlePaystackPayment}
      disabled={isProcessing}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>
        {isProcessing ? "Processing..." : "Pay with Paystack"}
      </Text>
    </TouchableOpacity>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
