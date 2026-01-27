import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { COLORS, SPACING } from '../../constants';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
}

interface CustomizationOption {
  id: string;
  label: string;
  items: { id: string; name: string; price: number }[];
  type: 'single' | 'multiple';
  required?: boolean;
}

const ViewItemScreen: React.FC = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const item = route.params?.item as MenuItem;

  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Mock customization options
  const customizations: CustomizationOption[] = [
    {
      id: 'sides',
      label: 'Select Sides (Choose up to 2)',
      type: 'multiple',
      items: [
        { id: 's1', name: 'Chips', price: 0 },
        { id: 's2', name: 'Salad', price: 0 },
        { id: 's3', name: 'Coleslaw', price: 0 },
        { id: 's4', name: 'Fries', price: 0 },
      ],
    },
    {
      id: 'drinks',
      label: 'Select Drink',
      type: 'single',
      required: false,
      items: [
        { id: 'd1', name: 'Coke', price: 2.99 },
        { id: 'd2', name: 'Sprite', price: 2.99 },
        { id: 'd3', name: 'Orange Juice', price: 3.49 },
        { id: 'd4', name: 'Water', price: 1.99 },
      ],
    },
    {
      id: 'extras',
      label: 'Add Extras',
      type: 'multiple',
      items: [
        { id: 'e1', name: 'Extra Cheese', price: 1.49 },
        { id: 'e2', name: 'Bacon', price: 1.99 },
        { id: 'e3', name: 'Extra Sauce', price: 0.99 },
        { id: 'e4', name: 'Avocado', price: 2.49 },
      ],
    },
  ];

  const calculateTotal = () => {
    let total = item.price * quantity;

    // Add drink price if selected
    if (selectedDrink) {
      const drink = customizations[1].items.find(d => d.id === selectedDrink);
      if (drink) total += drink.price;
    }

    // Add extras prices
    selectedExtras.forEach(extraId => {
      const extra = customizations[2].items.find(e => e.id === extraId);
      if (extra) total += extra.price;
    });

    return total;
  };

  const toggleSide = (sideId: string) => {
    if (selectedSides.includes(sideId)) {
      setSelectedSides(selectedSides.filter(id => id !== sideId));
    } else {
      if (selectedSides.length < 2) {
        setSelectedSides([...selectedSides, sideId]);
      } else {
        Alert.alert('Limit Reached', 'You can only select up to 2 sides');
      }
    }
  };

  const toggleExtra = (extraId: string) => {
    if (selectedExtras.includes(extraId)) {
      setSelectedExtras(selectedExtras.filter(id => id !== extraId));
    } else {
      setSelectedExtras([...selectedExtras, extraId]);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: item.id + Date.now(),
      name: item.name,
      price: calculateTotal() / quantity,
      quantity,
      image: item.image,
      customizations: {
        sides: selectedSides,
        drink: selectedDrink,
        extras: selectedExtras,
        specialInstructions,
      },
    };

    dispatch(addToCart(cartItem as any));
    Alert.alert('Success', `${item.name} added to cart!`, [
      { text: 'Continue Shopping', style: 'default' },
    ]);
  };

  const renderCustomizationGroup = (customization: CustomizationOption) => {
    if (customization.id === 'sides') {
      return (
        <View key={customization.id} style={styles.customizationGroup}>
          <Text style={styles.customizationTitle}>{customization.label}</Text>
          {customization.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkboxItem}
              onPress={() => toggleSide(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedSides.includes(item.id) && styles.checkboxSelected,
                ]}
              >
                {selectedSides.includes(item.id) && (
                  <Text style={styles.checkmark}></Text>
                )}
              </View>
              <Text style={styles.optionName}>{item.name}</Text>
              {item.price > 0 && (
                <Text style={styles.optionPrice}>+${item.price.toFixed(2)}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (customization.id === 'drinks') {
      return (
        <View key={customization.id} style={styles.customizationGroup}>
          <Text style={styles.customizationTitle}>{customization.label}</Text>
          {customization.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.radioItem,
                selectedDrink === item.id && styles.radioItemSelected,
              ]}
              onPress={() => setSelectedDrink(selectedDrink === item.id ? null : item.id)}
            >
              <View
                style={[
                  styles.radio,
                  selectedDrink === item.id && styles.radioSelected,
                ]}
              />
              <Text style={styles.optionName}>{item.name}</Text>
              <Text style={styles.optionPrice}>+${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (customization.id === 'extras') {
      return (
        <View key={customization.id} style={styles.customizationGroup}>
          <Text style={styles.customizationTitle}>{customization.label}</Text>
          {customization.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkboxItem}
              onPress={() => toggleExtra(item.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  selectedExtras.includes(item.id) && styles.checkboxSelected,
                ]}
              >
                {selectedExtras.includes(item.id) && (
                  <Text style={styles.checkmark}></Text>
                )}
              </View>
              <Text style={styles.optionName}>{item.name}</Text>
              <Text style={styles.optionPrice}>+${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Item not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Food Image */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.foodImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}></Text>
            </View>
          )}
        </View>

        {/* Food Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.foodDescription}>{item.description}</Text>

          {/* Customizations */}
          <View style={styles.customizationsSection}>
            <Text style={styles.sectionTitle}>Customize Your Order</Text>
            {customizations.map(renderCustomizationGroup)}

            {/* Special Instructions */}
            <View style={styles.customizationGroup}>
              <Text style={styles.customizationTitle}>Special Instructions</Text>
              <View style={styles.textInputContainer}>
                {/* Note: For a real app, use TextInput */}
                <Text style={styles.instructionText}>
                  {specialInstructions || 'Add any special requests here...'}
                </Text>
              </View>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Price Summary */}
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal:</Text>
              <Text style={styles.priceValue}>${(item.price * quantity).toFixed(2)}</Text>
            </View>
            {selectedDrink && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Drink:</Text>
                <Text style={styles.priceValue}>
                  +${(customizations[1].items.find(d => d.id === selectedDrink)?.price || 0).toFixed(2)}
                </Text>
              </View>
            )}
            {selectedExtras.length > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Extras:</Text>
                <Text style={styles.priceValue}>
                  +${selectedExtras
                    .reduce((sum, id) => {
                      const extra = customizations[2].items.find(e => e.id === id);
                      return sum + (extra?.price || 0);
                    }, 0)
                    .toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>${calculateTotal().toFixed(2)}</Text>
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#F0F0F0',
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
    backgroundColor: '#F5F5F5',
  },
  imagePlaceholderText: {
    fontSize: 80,
  },
  detailsContainer: {
    padding: SPACING.lg,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  foodPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  foodDescription: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  customizationsSection: {
    marginBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  customizationGroup: {
    marginBottom: SPACING.lg,
  },
  customizationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  radioItemSelected: {
    backgroundColor: '#F8F8F8',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
  },
  radioSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  textInputContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  priceBreakdown: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  totalRow: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  addToCartButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default ViewItemScreen;
