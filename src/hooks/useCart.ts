import { useDispatch, useSelector } from 'react-redux';
import { addToCart, clearCart, removeFromCart, updateQuantity } from '../store/cartSlice';
import { RootState } from '../store/store';
import { CartItem, DeliveryOption } from '../types';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const addItemToCart = (item: CartItem) => {
    dispatch(addToCart(item));
  };

  const removeItemFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateQuantity({ id: itemId, quantity }));
    }
  };

  const clearCartItems = () => {
    dispatch(clearCart());
  };

  const setDeliveryOption = (option: DeliveryOption) => {
    // TODO: Implement delivery option in cart slice
    console.log('Setting delivery option:', option);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  const getItemQuantity = (itemId: string) => {
    const item = cart.items.find((item: any) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const isItemInCart = (itemId: string) => {
    return cart.items.some((item: any) => item.id === itemId);
  };

  return {
    cart,
    addToCart: addItemToCart,
    removeFromCart: removeItemFromCart,
    updateItemQuantity,
    clearCartItems,
    setDeliveryOption,
    getTotalItems,
    getItemQuantity,
    isItemInCart,
  };
};
