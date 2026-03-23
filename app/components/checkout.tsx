import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../src/constants";
import PayUService, { PayUPaymentData } from "../../src/services/payuService";

// Mock implementation for react-native-paystack-webview

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

  const handlePayUPayment = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    console.log("🔥 PayU button clicked!");
    console.log("Email:", email);
    console.log("Amount:", totalAmount);
    
    setIsProcessing(true);
    
    try {
      // Generate unique transaction ID
      const transactionId = `KOM${Date.now()}`;
      
      // PayU requires amount in cents (multiply by 100)
      const amountInCents = Math.round(totalAmount * 100);

      // Calculate fees
      const fees = PayUService.calculateFees(amountInCents);

      // Create payment data
      const paymentData: PayUPaymentData = {
        merchantId: PayUService.isSandboxMode() ? "10000001" : "",
        merchantKey: PayUService.isSandboxMode() ? "testKey123" : "",
        return_url: "https://komEat.app/payment/return",
        cancel_url: "https://komEat.app/payment/cancel",
        notify_url: "https://komEat.app/payment/notify",
        email_address: email,
        amount: amountInCents,
        item_name: `KomEat Order ${transactionId}`,
        item_description: `Order payment for KomEat restaurant - R${totalAmount.toFixed(2)}`,
        m_payment_id: transactionId,
        name_first: "Customer",
        name_last: "Name",
        custom_str1: "mobile_app",
        custom_str2: "komEat_order",
        custom_int1: Date.now().toString(),
      };

      console.log("🚀 Initiating PayU payment:", paymentData);
      console.log("💳 Payment fees:", fees);
      
      // Process payment with PayU
      await PayUService.processPayment(paymentData);
      
      // On successful payment
      console.log("✅ PayU Payment Success - Transaction ID:", transactionId);
      
      // Call onSuccess with proper error handling
      try {
        await onSuccess();
      } catch (orderError) {
        console.error("Order creation failed:", orderError);
        throw orderError; // Re-throw to be caught by outer try-catch
      }
      
      Alert.alert(
        "Payment Successful", 
        `Your order has been placed!\n\nTransaction ID: ${transactionId}\nAmount: R ${totalAmount.toFixed(2)}\nPayment Method: PayU South Africa\n\nFees: R${(fees.totalFees / 100).toFixed(2)}\nNet Amount: R${(fees.netAmount / 100).toFixed(2)}`
      );

    } catch (error) {
      console.error("PayU payment error:", error);
      Alert.alert("Payment Error", "Failed to process payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  console.log("🔥 Checkout component rendering with PayU South Africa");
  
  return (
    <TouchableOpacity 
      style={[styles.button, isProcessing && styles.buttonDisabled]} 
      onPress={handlePayUPayment}
      disabled={isProcessing}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>
        {isProcessing ? "Processing..." : "Pay with PayU South Africa"}
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
