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

export default function ProfileScreen() {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user?.name || "N/A"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || "N/A"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{user?.phone || "N/A"}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{user?.role || "user"}</Text>
          </View>

          {user?.address && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{user.address.street}</Text>
              <Text style={styles.infoValue}>
                {user.address.city}, {user.address.state} {user.address.zipCode}
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
  infoCard: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
});
