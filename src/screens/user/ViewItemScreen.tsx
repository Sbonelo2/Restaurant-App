import { RouteProp } from '@react-navigation/native';
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
import QuantitySelector from '../../components/QuantitySelector';
import { MainStackParamList } from '../../navigation/MainNavigator';
import { RootState } from '../../store';
import { addToCart } from '../../store/cartSlice';

type ViewItemScreenRouteProp = RouteProp<MainStackParamList, 'ViewItem'>;

interface Props {
  route: ViewItemScreenRouteProp;
}

const ViewItemScreen: React.FC<Props> = ({ route }) => {
  const { itemId } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.food);
  
  const item = items.find(item => item.id === itemId);

  const handleAddToCart = async () => {
    if (!item) return;
    
    setLoading(true);
    try {
      await dispatch(addToCart({ 
        item: { ...item, quantity }, 
        quantity 
      }) as any);
      Alert.alert('Success', 'Item added to cart!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: item.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Details</Text>
            <Text style={styles.category}>Category: {item.category}</Text>
            <Text style={styles.availability}>
              Status: {item.available ? 'Available' : 'Out of Stock'}
            </Text>
          </View>

          <QuantitySelector
            quantity={quantity}
            onIncrease={() => setQuantity(quantity + 1)}
            onDecrease={() => quantity > 1 && setQuantity(quantity - 1)}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !item.available && styles.disabledButton,
            loading && styles.loadingButton
          ]}
          onPress={handleAddToCart}
          disabled={!item.available || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>
              {item.available ? 'Add to Cart' : 'Out of Stock'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF6B6B',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  availability: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addToCartButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loadingButton: {
    backgroundColor: '#FF6B6B',
    opacity: 0.7,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ViewItemScreen;
