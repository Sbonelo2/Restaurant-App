import { router } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { COLORS, SPACING } from "../../src/constants";
import { auth } from "../../src/services/firebase";
import { logout } from "../../src/store/authSlice";

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {user?.name || "User"}!</Text>
          <Text style={styles.subtitleText}>What would you like to eat today?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push("/cart")}
          >
            <Text style={styles.actionTitle}>🛒 View Cart</Text>
            <Text style={styles.actionSubtitle}>Check your order</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.actionTitle}>👤 My Profile</Text>
            <Text style={styles.actionSubtitle}>Manage your account</Text>
          </TouchableOpacity>

          {user?.role === "admin" && (
            <TouchableOpacity 
              style={[styles.actionCard, styles.adminCard]}
              onPress={() => Alert.alert("Coming Soon", "Admin dashboard will be available soon!")}
            >
              <Text style={styles.actionTitle}>⚙️ Admin Dashboard</Text>
              <Text style={styles.actionSubtitle}>Manage restaurant</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Items</Text>
          <Text style={styles.placeholderText}>Featured items will appear here</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  subtitleText: {
    fontSize: 16,
    color: COLORS.secondary,
    opacity: 0.8,
  },
  section: {
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionCard: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
  logoutButton: {
    backgroundColor: "#DC3545",
    margin: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
