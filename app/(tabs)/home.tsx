import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, getImageSource } from "../../src/constants";
import { getMenuItems, MenuItem } from "../../src/services/menuServices";
import { addItem } from "../../src/store/cartSlice";
import CategoryFilter from "../components/CategoryFilter";
import HomeHeader from "../components/HomeHeader";

const { width: screenWidth } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* FETCH MENU (PUBLIC) */
  useEffect(() => {
    getMenuItems().then((data) => setMenu(data));
  }, []);

  /* FILTER + SEARCH */
  const finalMenu = useMemo(() => {
    let filtered = menu;

    if (selectedCategory !== "All") {
      if (selectedCategory === "Popular")
        filtered = filtered.filter((i) => i.popular);
      else if (selectedCategory === "New")
        filtered = filtered.filter((i) => i.new);
      else filtered = filtered.filter((i) => i.category === selectedCategory);
    }

    if (searchQuery.trim().length > 0) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [menu, selectedCategory, searchQuery]);

  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      // Show login/register prompt
      Alert.alert(
        "Login Required",
        "Please login or register to add items to cart",
        [
          {
            text: "Login",
            onPress: () => router.push('/auth/login')
          },
          {
            text: "Register", 
            onPress: () => router.push('/auth/register')
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      );
      return;
    }

    // User is logged in, proceed with adding to cart
    dispatch(
      addItem({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        quantity: 1,
        image: item.image,
      }),
    );
  };

  const categories = [
    "All",
    "Popular",
    "New",
    ...Array.from(new Set(menu.map((i) => i.category))),
  ];
  const popularItems = menu.filter((i) => i.popular);
  const newItems = menu.filter((i) => i.new);

  /*** KOMEAT LOGO ***/
  const logoData = {
    image: require('../../assets/images/KomEat Logo.png'),
    text: "KomEat",
  };

  const heroRef = useRef<FlatList>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % 1; // Only one logo item
      heroRef.current?.scrollToIndex({ index, animated: true });
    }, 3000); // auto scroll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={finalMenu}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <HomeHeader onSearch={setSearchQuery} />

            {/* KOMEAT LOGO */}
            <View style={{ marginVertical: 16 }}>
              <View style={styles.logoContainer}>
                <Image
                  source={logoData.image}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <Text style={styles.logoText}>{logoData.text}</Text>
              </View>
              
              {/* LOGIN/REGISTER BUTTONS */}
              {!user && (
                <View style={styles.authContainer}>
                  <TouchableOpacity
                    style={[styles.authButton, styles.loginButton]}
                    onPress={() => router.push('/auth/login')}
                  >
                    <Ionicons name="log-in" size={18} color={COLORS.secondary} />
                    <Text style={styles.authButtonText}>Login</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.authButton, styles.registerButton]}
                    onPress={() => router.push('/auth/register')}
                  >
                    <Ionicons name="person-add" size={18} color={COLORS.secondary} />
                    <Text style={styles.authButtonText}>Register</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* 🔥 POPULAR */}
            {selectedCategory === "All" && popularItems.length > 0 && (
              <>
                <Text style={styles.heading}>Popular Now</Text>
                <FlatList
                  data={popularItems}
                  keyExtractor={(i) => i.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.popularCard}
                      onPress={() =>
                        router.push({
                          pathname: "/food/[id]",
                          params: { id: item.id },
                        })
                      }
                    >
                      <Image
                        source={getImageSource(item.image)}
                        style={styles.popularImage}
                      />
                      <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>
                          R {item.price.toFixed(2)}
                        </Text>
                        <TouchableOpacity
                          style={styles.addCartBtn}
                          onPress={() => handleAddToCart(item)}
                        >
                          <Ionicons name="cart" size={18} color="#fff" />
                          <Text style={styles.addCartText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {/* 🆕 NEW ITEMS */}
            {selectedCategory === "All" && newItems.length > 0 && (
              <>
                <Text style={styles.heading}>New Items</Text>
                <FlatList
                  data={newItems}
                  keyExtractor={(i) => i.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.popularCard}
                      onPress={() =>
                        router.push({
                          pathname: "/food/[id]",
                          params: { id: item.id },
                        })
                      }
                    >
                      <Image
                        source={getImageSource(item.image)}
                        style={styles.popularImage}
                      />
                      <View style={styles.info}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.price}>
                          R {item.price.toFixed(2)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}

            {menu.length > 0 && <Text style={styles.heading}>Categories</Text>}
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/food/[id]", params: { id: item.id } })
            }
          >
            <Image source={getImageSource(item.image)} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.price}>R {item.price?.toFixed(2) || '0.00'}</Text>

              <TouchableOpacity
                style={styles.addCartBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Ionicons name="cart" size={18} color="#fff" />
                <Text style={styles.addCartText}>Add</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    marginTop: 15,
  },
  listContent: { paddingBottom: 20 },
  heading: { fontSize: 24, fontWeight: "bold", marginVertical: 12 },
  heroCard: {
    width: screenWidth - 32,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 12,
  },
  heroText: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: COLORS.surface,
  },
  logoImage: {
    width: 200,
    height: 80,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
  },
  authContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 10,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
  },
  registerButton: {
    backgroundColor: COLORS.accent,
  },
  authButtonText: {
    color: COLORS.secondary,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
  popularCard: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 14,
  },
  popularImage: { width: "100%", height: 140 },
  card: { backgroundColor: "#fff", borderRadius: 16, marginBottom: 16 },
  image: { width: "100%", height: 180 },
  info: { padding: 14 },
  name: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#777", marginVertical: 6 },
  price: { color: COLORS.primary, fontWeight: "bold" },
  addCartBtn: {
    position: "absolute",
    right: 14,
    bottom: 2,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    padding: 6,
    borderRadius: 20,
  },
  addCartText: { color: "#fff", marginLeft: 6 },
});
