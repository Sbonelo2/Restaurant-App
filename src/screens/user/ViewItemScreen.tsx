import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { RootState } from '../../store';
import { COLORS } from '../../constants';

const ViewItemScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = () => {
    // Mock item data - in a real app, this would come from route params
    const mockItem = {
      id: '1',
      name: 'Burger',
      price: 12.99,
      quantity: 1,
      image: 'https://example.com/burger.jpg',
    };
    
    dispatch(addToCart(mockItem));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Item Details</Text>
      
      <View style={styles.content}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>Food Image</Text>
        </View>
        
        <Text style={styles.itemName}>Delicious Burger</Text>
        <Text style={styles.itemPrice}>.99</Text>
        <Text style={styles.itemDescription}>
          A delicious beef burger with fresh lettuce, tomato, and our special sauce.
        </Text>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageText: {
    color: COLORS.textLight,
    fontSize: 16,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  itemDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ViewItemScreen;