import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ item: CartItem; quantity: number }>) => {
      const { item, quantity } = action.payload;
      const existingItem = state.items.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }

      // Recalculate total and item count
      state.total = state.items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
      state.itemCount = state.items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // Recalculate total and item count
      state.total = state.items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
      state.itemCount = state.items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        } else {
          existingItem.quantity = quantity;
        }

        // Recalculate total and item count
        state.total = state.items.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
        state.itemCount = state.items.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
