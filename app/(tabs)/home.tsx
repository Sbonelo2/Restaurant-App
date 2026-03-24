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
import { getImageSource } from "../../src/constants";
import { saveCartToFirestore } from "../../src/services/cartFirestore";
import { getMenuItems, MenuItem } from "../../src/services/menuServices";
import { store } from "../../src/store";
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
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price || 0,
      quantity: 1,
      image: item.image,
    };
    
    dispatch(addItem(cartItem));
    
    // Save to Firestore immediately
    if (user) {
      const currentCart = store.getState().cart.items;
      saveCartToFirestore(user.uid, [...currentCart, cartItem]);
    }
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
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 16,
    marginTop: 15,
  },
  listContent: { paddingBottom: 20 },
  heading: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginVertical: 12,
    color: "#000000",
  },
  heroCard: {
    width: screenWidth - 32,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  heroImage: { width: "100%", height: "100%" },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
  },
  heroText: { 
    color: "#fff", 
    fontSize: 22, 
    fontWeight: "bold",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    letterSpacing: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoImage: {
    width: 200,
    height: 80,
    resizeMode: "contain",
    marginBottom: 8,
  },
  popularCard: {
    width: 240,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginRight: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  popularImage: { 
    width: "100%", 
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  card: { 
    backgroundColor: "#ffffff", 
    borderRadius: 16, 
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  image: { 
    width: "100%", 
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  info: { 
    padding: 16,
  },
  name: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  desc: { 
    color: "#666666", 
    marginVertical: 6,
    fontSize: 14,
    lineHeight: 18,
  },
  price: { 
    color: "#000000", 
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  addCartBtn: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#000000",
    flexDirection: "row",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  addCartText: { 
    color: "#fff", 
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
  },
});
