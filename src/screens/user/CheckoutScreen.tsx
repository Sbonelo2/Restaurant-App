import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../../store';
import { clearCart } from '../../store/cartSlice';
import { COLORS, SPACING, DELIVERY_OPTIONS, PAYMENT_METHODS } from '../../constants';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

type CheckoutScreenNavigationProp = NativeStackNavigationProp<any>;

const CheckoutScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [deliveryOption, setDeliveryOption] = useState(DELIVERY_OPTIONS[1]);
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address ? `${user.address.street}, ${user.address.city}` : ''
  );
  const [useDefaultAddress, setUseDefaultAddress] = useState(!!user?.address);
  const [customAddress, setCustomAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const TAX_RATE = 0.08;
  const subtotal = total;
  const tax = subtotal * TAX_RATE;
  const deliveryFee = deliveryOption.id === 'pickup' ? 0 : deliveryOption.fee;
  const orderTotal = subtotal + tax + deliveryFee;

  if (!isAuthenticated || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthContainer}>
          <Text style={styles.notAuthTitle}>Sign In Required</Text>
          <Text style={styles.notAuthText}>
            You need to be signed in to place an order. Please sign in or create an account.
          </Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.authButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.authButton, styles.signupButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptyText}>Add items to your cart before checking out.</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // Create order object
        const order = {
          id: 'ORD-' + Date.now(),
          userId: user.id,
          items,
          subtotal,
          tax,
          deliveryFee,
          total: orderTotal,
          deliveryOption,
          paymentMethod: selectedPayment,
          deliveryAddress: useDefaultAddress ? user.address : customAddress,
          orderDate: new Date(),
          status: 'pending',
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60000), // 45 min from now
        };

        // Log order (in a real app, this would be sent to backend/Firebase)
        console.log('Order placed:', order);

        // Show success message
        Alert.alert('Order Confirmed', `Your order #${order.id} has been placed successfully!`, [
          {
            text: 'Track Order',
            onPress: () => {
              dispatch(clearCart());
              navigation.navigate('Orders');
            },
          },
        ]);

        // Clear cart
        dispatch(clearCart());
      } catch (error) {
        Alert.alert('Error', 'Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Order Summary</Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.cartList}
          />
        </View>

        {/* Delivery Option */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Option</Text>
          {DELIVERY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                deliveryOption.id === option.id && styles.optionCardSelected,
              ]}
              onPress={() => setDeliveryOption(option)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    deliveryOption.id === option.id && styles.radioButtonSelected,
                  ]}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionName}>{option.name}</Text>
                <Text style={styles.optionTime}>{option.time}</Text>
              </View>
              <Text style={styles.optionFee}>
                {option.fee === 0 ? 'FREE' : `$${option.fee.toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {user?.address && (
            <TouchableOpacity
              style={[
                styles.addressOption,
                useDefaultAddress && styles.addressOptionSelected,
              ]}
              onPress={() => setUseDefaultAddress(true)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    useDefaultAddress && styles.radioButtonSelected,
                  ]}
                />
              </View>
              <Text style={styles.addressText}>
                {user.address.street}, {user.address.city}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.addressOption,
              !useDefaultAddress && styles.addressOptionSelected,
            ]}
            onPress={() => setUseDefaultAddress(false)}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioButton,
                  !useDefaultAddress && styles.radioButtonSelected,
                ]}
              />
            </View>
            <Text style={styles.addressText}>Use Different Address</Text>
          </TouchableOpacity>
          {!useDefaultAddress && (
            <TextInput
              style={styles.addressInput}
              placeholder="Enter delivery address"
              value={customAddress}
              onChangeText={setCustomAddress}
              editable={!loading}
            />
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionCard,
                selectedPayment.id === method.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedPayment(method)}
            >
              <View style={styles.radioContainer}>
                <View
                  style={[
                    styles.radioButton,
                    selectedPayment.id === method.id && styles.radioButtonSelected,
                  ]}
                />
              </View>
              <Text style={styles.optionName}>{method.name}</Text>
            </TouchableOpacity>
          ))}
          {selectedPayment.id === 'card' && user?.cardDetails && (
            <View style={styles.cardInfo}>
              <Text style={styles.cardInfoText}>
                Card ending in {user.cardDetails.cardNumber}
              </Text>
            </View>
          )}
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Tax (8%)</Text>
              <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{deliveryOption.name} Fee</Text>
              <Text style={styles.priceValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>${orderTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderButtonText}>
            {loading ? 'Processing...' : 'Place Order'}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
  },
  cartList: {
    marginBottom: SPACING.md,
  },
  cartItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemQuantity: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8F8F8',
  },
  radioContainer: {
    marginRight: SPACING.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionTime: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  optionFee: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  addressOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8F8F8',
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 14,
    color: COLORS.text,
  },
  cardInfo: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  cardInfoText: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceBreakdown: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  totalRow: {
    marginTop: SPACING.md,
    paddingTopWidth: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  placeOrderButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  notAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  notAuthTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  notAuthText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  authButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
    width: '100%',
  },
  signupButton: {
    backgroundColor: COLORS.border,
  },
  authButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  signupButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
