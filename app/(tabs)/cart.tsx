import { router } from "expo-router";
import React from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS, SPACING } from "../../src/constants";
import { clearCart, removeFromCart, updateQuantity } from "../../src/store/cartSlice";

export default function CartScreen() {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: any) => state);

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (cart.items.length > 0) {
      Alert.alert("Checkout", "Checkout functionality coming soon! Total: R" + cart.total.toFixed(2));
    }
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>R{(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Cart</Text>
        </View>

        <View style={styles.content}>
          {cart.items.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Your cart is empty</Text>
              <Text style={styles.emptyStateSubtext}>Add some delicious items!</Text>
              <TouchableOpacity 
                style={styles.shopButton}
                onPress={() => router.replace("/home")}
              >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <FlatList
                data={cart.items}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                style={styles.cartList}
              />
              
              <View style={styles.summary}>
                <Text style={styles.totalText}>Total: R{cart.total.toFixed(2)}</Text>
                
                <View style={styles.summaryActions}>
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={handleClearCart}
                  >
                    <Text style={styles.clearButtonText}>Clear Cart</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  content: {
    padding: SPACING.lg,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl * 2,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    opacity: 0.7,
    marginBottom: SPACING.lg,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: "center",
  },
  shopButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  cartList: {
    marginBottom: SPACING.md,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: SPACING.md,
  },
  quantityButton: {
    backgroundColor: COLORS.border,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginHorizontal: SPACING.sm,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "#DC3545",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
  },
  removeButtonText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.lg,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  summaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearButton: {
    backgroundColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    flex: 1,
    marginRight: SPACING.sm,
  },
  clearButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    flex: 2,
  },
  checkoutButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
