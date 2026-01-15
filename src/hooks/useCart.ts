import { useDispatch, useSelector } from 'react-redux';
import {
    addItem,
    clearCart,
    removeItem,
    updateQuantity
} from '../store/foodSlice';
import { RootState } from '../store/store';
import { CartItem, DeliveryOption } from '../types';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.food.cart);

  const addToCart = (item: CartItem) => {
    dispatch(addItem(item));
  };

  const removeFromCart = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity }));
    }
  };

  const clearCartItems = () => {
    dispatch(clearCart());
  };

  const setDeliveryOption = (option: DeliveryOption) => {
    dispatch(setDeliveryOption(option));
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (itemId: string) => {
    return cart.items.some(item => item.id === itemId);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCartItems,
    setDeliveryOption,
    getTotalItems,
    getItemQuantity,
    isItemInCart,
  };
};
