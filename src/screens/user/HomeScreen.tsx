import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '../../store';
import { fetchFoodItems } from '../../store/foodSlice';
import { COLORS, CATEGORIES, SPACING } from '../../constants';

type HomeScreenNavigationProp = NativeStackNavigationProp<any>;

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { items: foodItems, loading } = useSelector((state: RootState) => state.food);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    dispatch(fetchFoodItems() as any);
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredItems(foodItems.filter(item => item.category === selectedCategory));
    } else {
      setFilteredItems(foodItems);
    }
  }, [selectedCategory, foodItems]);

  const handleFoodItemPress = (item: FoodItem) => {
    navigation.navigate('ViewItem', { item });
  };

  const renderFoodCard = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={[styles.foodCard, !item.available && styles.unavailableCard]}
      onPress={() => handleFoodItemPress(item)}
      disabled={!item.available}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.foodImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}></Text>
          </View>
        )}
        {!item.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Unavailable</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.foodName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.foodDescription} numberOfLines={2}>{item.description}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
          {item.available && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleFoodItemPress(item)}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTab = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryTab,
        selectedCategory === category.name && styles.activeCategory,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
    >
      <Text style={styles.categoryIcon}>{category.icon}</Text>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === category.name && styles.activeCategoryName,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome to KomEat!</Text>
          {isAuthenticated && user && (
            <Text style={styles.userName}>{user.name || 'User'}</Text>
          )}
        </View>
        <Text style={styles.tagline}>Good Food, Fast Delivery</Text>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderFoodCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <FlatList
              data={CATEGORIES}
              renderItem={({ item }) => renderCategoryTab(item)}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
            />
          </>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No food items available</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: SPACING.sm,
  },
  userName: {
    fontSize: 14,
    color: COLORS.secondary,
    opacity: 0.8,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: SPACING.sm,
    opacity: 0.9,
  },
  categoriesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
  },
  categoriesList: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  categoryTab: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeCategoryName: {
    color: COLORS.secondary,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  foodCard: {
    width: '48%',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableCard: {
    opacity: 0.6,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5F5',
  },
  foodImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  imagePlaceholderText: {
    fontSize: 40,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
  },
  unavailableText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: SPACING.sm,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  foodDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    lineHeight: 14,
    marginBottom: SPACING.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default HomeScreen;
