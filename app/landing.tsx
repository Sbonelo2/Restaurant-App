import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { COLORS } from "../src/constants";

const { width, height } = Dimensions.get("window");

export default function Landing() {
  const router = useRouter();

  const features = [
    {
      icon: "fast-food",
      title: "Quality Food",
      description: "Fresh ingredients prepared with care",
    },
    {
      icon: "time",
      title: "Fast Delivery",
      description: "Quick delivery to your doorstep",
    },
    {
      icon: "card",
      title: "Easy Payment",
      description: "Secure and convenient payment options",
    },
    {
      icon: "star",
      title: "Customer Satisfaction",
      description: "Rated 4.8+ by our happy customers",
    },
  ];

  const menuHighlights = [
    {
      name: "Classic Burger",
      price: "R125.99",
      description: "Juicy beef patty with fresh toppings",
    },
    {
      name: "Pizza Margherita",
      price: "R155.99", 
      description: "Traditional Italian pizza with mozzarella",
    },
    {
      name: "Grilled Salmon",
      price: "R185.99",
      description: "Fresh Atlantic salmon grilled to perfection",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/KomEat Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>KomEat</Text>
          <Text style={styles.tagline}>Delicious Food, Delivered Fast</Text>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push("/(tabs)/home")}
        >
          <Ionicons name="home" as any size={20} color={COLORS.secondary} />
          <Text style={styles.primaryButtonText}>Browse Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push("/auth/login")}
        >
          <Ionicons name="log-in" as any size={20} color={COLORS.primary} />
          <Text style={styles.secondaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose KomEat?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.iconContainer}>
                <Ionicons name={feature.icon as any} size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Dishes</Text>
        {menuHighlights.map((item, index) => (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemName}>{item.name}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
              <Text style={styles.menuItemPrice}>{item.price}</Text>
            </View>
            <View style={styles.menuItemAction}>
              <TouchableOpacity
                style={styles.menuItemButton}
                onPress={() => router.push("/(tabs)/home")}
              >
                <Ionicons name="arrow-forward" as any size={16} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1000+</Text>
          <Text style={styles.statLabel}>Happy Customers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Menu Items</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Average Rating</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 KomEat. All rights reserved.</Text>
        <Text style={styles.footerText}>Made with ❤️ for food lovers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  hero: {
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  brandName: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: COLORS.secondary,
    opacity: 0.9,
    textAlign: "center",
  },
  ctaContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: -30,
    gap: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  featureCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  menuItem: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  menuItemAction: {
    marginLeft: 12,
  },
  menuItemButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});
