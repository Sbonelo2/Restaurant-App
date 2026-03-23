import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { auth } from "../../src/services/firebase";

export default function TabsLayout() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // 🔐 Listen for auth state (used to protect tabs)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return unsub;
  }, []);

  // ✅ CART BADGE
  const cartItems = useSelector((state: any) => state.cart.items);
  const cartCount = cartItems.reduce(
    (total: number, item: any) => total + item.quantity,
    0,
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ff6b00",
        headerStyle: { backgroundColor: "#ff6b00" },
        headerTintColor: "#fff",
      }}
    >
      {/* 🏠 MENU — PUBLIC */}
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/KomEat Logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Menu</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* 🛒 CART — PUBLIC */}
      <Tabs.Screen
        name="cart"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/KomEat Logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Cart</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),

          // ✅ Cart Badge
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />

      {/* 📦 ORDERS — LOGIN REQUIRED */}
      <Tabs.Screen
        name="orders"
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              router.push("/auth/login");
            }
          },
        }}
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../assets/images/KomEat Logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>Orders</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      {/* 👤 PROFILE — LOGIN REQUIRED */}
      <Tabs.Screen
        name="profile"
        listeners={{
          tabPress: (e) => {
            if (!user) {
              e.preventDefault();
              router.push("/auth/login");
            }
          },
        }}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* 💳 CHECKOUT — HIDDEN & PROTECTED */}
      <Tabs.Screen
        name="checkout"
        options={{
          href: null, // ✅ completely removes from navigation
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
