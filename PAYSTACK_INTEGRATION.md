# Paystack Payment Integration

## Overview
This document outlines the Paystack payment gateway integration for the KomEat restaurant app.

## Configuration
- **Environment**: Test/Sandbox
- **Public Key**: `pk_test_1007d41beea87c548453d0f21b4d85a6f2e6fa85`
- **Currency**: ZAR (South African Rand)
- **Base URL**: `https://api.paystack.co`

## Features Implemented

### 1. Payment Initialization
- Generate unique transaction references
- Calculate payment fees (1.5% + R2.50 flat fee)
- Support multiple payment channels (card, bank, USSD, QR)
- Custom metadata for order tracking

### 2. Payment Processing
- Real-time payment status updates
- Error handling and user feedback
- Payment success/failure callbacks
- Transaction cancellation handling

### 3. Fee Calculation
```typescript
// Paystack charges 1.5% + R2.50 flat fee
const percentageFee = amount * 0.015; // 1.5%
const flatFee = 2.50; // R2.50 flat fee
const totalFee = percentageFee + flatFee;
```

### 4. Payment Verification
- Server-side payment verification
- Transaction reference validation
- Payment status confirmation

## API Endpoints

### Initialize Payment
```
POST https://api.paystack.co/transaction/initialize
```

### Verify Payment
```
GET https://api.paystack.co/transaction/verify/{reference}
```

## Integration Files

### 1. Paystack Service (`src/services/paystackService.ts`)
- Core payment logic
- Fee calculations
- Payment initialization
- Verification functions

### 2. Checkout Component (`app/components/checkout.tsx`)
- Payment UI component
- User interaction handling
- Payment flow orchestration

## Usage Example

```typescript
import PaystackService from '../../src/services/paystackService';

// Initialize payment
const result = await PaystackService.initializePaystackPayment(
  email: "user@example.com",
  amount: 1000, // R10.00
  reference: "KOM1234567890",
  metadata: {
    order_id: "KOM1234567890",
    restaurant: "KomEat",
    amount: 1000,
    fees: 17.50
  }
);

// Verify payment
const verification = await PaystackService.verifyPaystackPayment("KOM1234567890");
```

## Payment Flow

1. **User Clicks "Pay with Paystack"**
   - Generate unique transaction reference
   - Calculate payment fees
   - Initialize payment with Paystack

2. **Payment Processing**
   - User redirected to Paystack payment page
   - User selects payment method and completes payment
   - Paystack processes payment and returns result

3. **Payment Completion**
   - Success: Show confirmation and create order
   - Failure: Show error message and allow retry
   - Cancelled: Show cancellation message

## Error Handling

### Common Error Scenarios
- **Network Issues**: Retry mechanism with user notification
- **Invalid Email**: Email validation before payment
- **Insufficient Funds**: Clear error message
- **Payment Timeout**: Automatic retry option

### Error Messages
- "Payment could not be processed. Please try again."
- "An error occurred while processing your payment. Please try again."
- "Payment cancelled. You may try again."

## Security Considerations

1. **API Key Management**
   - Test key used for development
   - Production key to be configured separately
   - Keys stored securely in environment variables

2. **Transaction Security**
   - Unique transaction references
   - Payment verification on server
   - Secure callback URLs

3. **Data Protection**
   - No sensitive data stored locally
   - Encrypted communication with Paystack
   - PCI compliance considerations

## Testing

### Test Cards
- **Success Card**: Use valid test card details in Paystack sandbox
- **Failure Card**: Use declined test card to test failure scenarios

### Test Scenarios
1. **Successful Payment**: Complete payment flow
2. **Failed Payment**: Test error handling
3. **Cancelled Payment**: Test cancellation flow
4. **Network Issues**: Test retry mechanisms

## Production Deployment

### Steps for Production
1. Update Paystack configuration with production keys
2. Set up proper callback URLs
3. Configure webhook endpoints
4. Test with real payment methods
5. Monitor payment success rates

### Environment Variables
```bash
PAYSTACK_PUBLIC_KEY=pk_live_your_production_key
PAYSTACK_BASE_URL=https://api.paystack.co
```

## Support

### Paystack Documentation
- [Paystack Docs](https://paystack.com/docs)
- [React Native Integration](https://paystack.com/docs/payments/react-native)
- [API Reference](https://paystack.com/docs/api)

### Common Issues
- **Payment Timeouts**: Check network connectivity
- **Invalid Currency**: Ensure ZAR is supported
- **Webhook Failures**: Verify endpoint accessibility

## Future Enhancements

1. **Recurring Payments**: Support for subscription models
2. **Split Payments**: Multiple payment recipients
3. **International Cards**: Support for foreign cards
4. **Apple Pay/Google Pay**: Mobile wallet integration
5. **Payment Analytics**: Detailed payment reporting

## Compliance

- **PCI DSS**: Payment card industry compliance
- **POPIA**: South African data protection
- **GDPR**: General data protection regulation
- **KYC**: Know your customer requirements

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Integration Status**: Active
