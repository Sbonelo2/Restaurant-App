import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addToCart } from '../../store/cartSlice';

interface FoodItemScreenProps {
  route: {
    params: {
      item: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        category: string;
      };
    };
  };
}

interface CustomizationOptions {
  sides: string[];
  drinks: string[];
  extras: { name: string; price: number }[];
  ingredients: { name: string; included: boolean }[];
}

const FoodItemScreen: React.FC<FoodItemScreenProps> = ({ route }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<{ name: string; included: boolean }[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Mock customization options
  const customizationOptions: CustomizationOptions = {
    sides: ['French Fries', 'Pap', 'Salad', 'Chips', 'Rice'],
    drinks: ['Coke', 'Fanta', 'Sprite', 'Water', 'Juice'],
    extras: [
      { name: 'Extra Fries', price: 3.99 },
      { name: 'Extra Cheese', price: 1.99 },
      { name: 'Bacon', price: 2.99 },
      { name: 'Avocado', price: 2.49 },
      { name: 'Extra Sauce', price: 0.99 },
    ],
    ingredients: [
      { name: 'Lettuce', included: true },
      { name: 'Tomato', included: true },
      { name: 'Onion', included: true },
      { name: 'Pickles', included: false },
      { name: 'Cheese', included: true },
    ],
  };

  React.useEffect(() => {
    setIngredients(customizationOptions.ingredients);
  }, []);

  const calculateTotalPrice = () => {
    let totalPrice = item.price * quantity;
    
    // Add extras price
    selectedExtras.forEach(extra => {
      const extraItem = customizationOptions.extras.find(e => e.name === extra);
      if (extraItem) {
        totalPrice += extraItem.price;
      }
    });
    
    return totalPrice;
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to add items to cart', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => {} },
      ]);
      return;
    }

    setLoading(true);
    
    const cartItem = {
      id: item.id,
      name: item.name,
      price: calculateTotalPrice(),
      image: item.image,
      quantity,
      customization: {
        sides: selectedSides,
        drink: selectedDrink,
        extras: selectedExtras,
        ingredients: ingredients.filter(ing => ing.included).map(ing => ing.name),
      },
    };

    setTimeout(() => {
      dispatch(addToCart({ item: cartItem, quantity }));
      setLoading(false);
      Alert.alert('Success', 'Item added to cart!');
    }, 500);
  };

  const toggleSide = (side: string) => {
    setSelectedSides(prev => 
      prev.includes(side) 
        ? prev.filter(s => s !== side)
        : [...prev, side]
    );
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  const toggleIngredient = (index: number) => {
    setIngredients(prev => 
      prev.map((ing, i) => 
        i === index ? { ...ing, included: !ing.included } : ing
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>Base Price: ${item.price.toFixed(2)}</Text>

        {/* Quantity Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sides Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Sides (Select up to 2)</Text>
          {customizationOptions.sides.map((side, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedSides.includes(side) && styles.optionButtonSelected,
              ]}
              onPress={() => {
                if (selectedSides.includes(side)) {
                  toggleSide(side);
                } else if (selectedSides.length < 2) {
                  toggleSide(side);
                } else {
                  Alert.alert('Limit Reached', 'You can only select up to 2 sides');
                }
              }}
            >
              <Text style={[
                styles.optionText,
                selectedSides.includes(side) && styles.optionTextSelected,
              ]}>
                {side}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Drink Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Drink</Text>
          {customizationOptions.drinks.map((drink, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedDrink === drink && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedDrink(drink)}
            >
              <Text style={[
                styles.optionText,
                selectedDrink === drink && styles.optionTextSelected,
              ]}>
                {drink}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extras Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extras (Additional Cost)</Text>
          {customizationOptions.extras.map((extra, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedExtras.includes(extra.name) && styles.optionButtonSelected,
              ]}
              onPress={() => toggleExtra(extra.name)}
            >
              <Text style={[
                styles.optionText,
                selectedExtras.includes(extra.name) && styles.optionTextSelected,
              ]}>
                {extra.name} (+${extra.price.toFixed(2)})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ingredients Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                ingredient.included && styles.optionButtonSelected,
              ]}
              onPress={() => toggleIngredient(index)}
            >
              <Text style={[
                styles.optionText,
                ingredient.included && styles.optionTextSelected,
              ]}>
                {ingredient.included ? '✓ ' : '✗ '}{ingredient.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Price */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>
            Total: ${calculateTotalPrice().toFixed(2)}
          </Text>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[styles.addToCartButton, loading && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>Add to Cart</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    marginBottom: 16,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityButton: {
    backgroundColor: '#FF6B6B',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  optionButtonSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
  totalContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addToCartButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default FoodItemScreen;
