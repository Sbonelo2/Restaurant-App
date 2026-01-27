import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";

import { COLORS, SPACING } from "../../src/constants";

export default function CartScreen() {
  const { cart } = useSelector((state: any) => state);

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
            </View>
          ) : (
            <View>
              <Text style={styles.itemCount}>
                {cart.items.length} items in your cart
              </Text>
              <Text style={styles.totalText}>
                Total: ${cart.total.toFixed(2)}
              </Text>
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
  },
  itemCount: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
});
