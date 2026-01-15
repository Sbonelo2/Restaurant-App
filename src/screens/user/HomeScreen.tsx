import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CategoryTabs from '../../components/CategoryTabs';
import FoodCard from '../../components/FoodCard';
import { COLORS, RESTAURANT_NAME, RESTAURANT_TAGLINE } from '../../constants';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { RootState } from '../../store';
import { fetchFoodItems } from '../../store/foodSlice';

type HomeScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Home'>;

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  const { items, loading, categories } = useSelector((state: RootState) => state.food);

  useEffect(() => {
    dispatch(fetchFoodItems() as any);
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchFoodItems() as any);
    setRefreshing(false);
  };

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter((item: FoodItem) => item.category === selectedCategory);

  const renderItem = ({ item }: { item: FoodItem }) => (
    <FoodCard
      item={item}
      onPress={() => navigation.navigate('ViewItem', { itemId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{RESTAURANT_NAME}</Text>
        <Text style={styles.headerSubtitle}>{RESTAURANT_TAGLINE}</Text>
      </View>

      <CategoryTabs
        categories={['All', ...categories]}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items available</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.secondary,
    opacity: 0.9,
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;
