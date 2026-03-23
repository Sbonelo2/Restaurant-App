import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  deleteCartFromFirestore,
  loadCartFromFirestore,
  saveCartToFirestore
} from "../services/cartFirestore";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sides?: string[];
  drinks?: { id: string; name: string; price: number }[];
  extras?: { id: string; name: string; price: number }[];
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// 🔥 Load cart from Firestore with merge
export const syncCartWithFirestore = createAsyncThunk(
  "cart/syncCartWithFirestore",
  async ({ userId, localItems }: { userId: string; localItems: CartItem[] }) => {
    try {
      // Load from Firestore
      const firestoreItems = await loadCartFromFirestore(userId);
      
      // Merge local and Firestore carts to handle conflicts
      const mergedItems = [...localItems];
      
      // Add items from Firestore that aren't in local
      firestoreItems.forEach((firestoreItem: CartItem) => {
        const existingLocal = localItems.find((local: CartItem) => local.id === firestoreItem.id);
        if (!existingLocal) {
          mergedItems.push(firestoreItem);
        }
      });
      
      // Save merged cart back to Firestore
      await saveCartToFirestore(userId, mergedItems);
      
      return mergedItems;
    } catch (error) {
      console.error("❌ Error syncing cart with Firestore:", error);
      return localItems; // Fallback to local items
    }
  }
);

// 🔥 Save cart to Firestore
export const saveCartToFirestoreThunk = createAsyncThunk(
  "cart/saveCartToFirestore",
  async ({ userId, items }: { userId: string; items: CartItem[] }) => {
    await saveCartToFirestore(userId, items);
    return items;
  }
);

// 🔥 Clear cart from Firestore
export const clearCartFromFirestoreThunk = createAsyncThunk(
  "cart/clearCartFromFirestore",
  async (userId: string) => {
    await deleteCartFromFirestore(userId);
    return [];
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      // Note: Actual Firestore save happens in component after dispatch
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      // Note: Actual Firestore save happens in component after dispatch
    },

    incrementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity += 1;
      // Note: Actual Firestore save happens in component after dispatch
    },

    decrementQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      // Note: Actual Firestore save happens in component after dispatch
    },

    clearCart: (state) => {
      state.items = [];
      // Note: Actual Firestore save happens in component after dispatch
    },

    // Save cart in state
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // ✅ UPDATE EXTRAS + DRINKS FOR A CART ITEM
    updateItemExtras: (
      state,
      action: PayloadAction<{
        itemId: string;
        extras: { id: string; name: string; price: number }[];
        drinks: { id: string; name: string; price: number }[];
      }>
    ) => {
      const { itemId, extras, drinks } = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        item.extras = extras;
        item.drinks = drinks;
      }
      // Note: Actual Firestore save happens in component after dispatch
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(syncCartWithFirestore.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(saveCartToFirestoreThunk.fulfilled, (state, action) => {
        console.log("✅ Cart saved to Firestore successfully");
      })
      .addCase(clearCartFromFirestoreThunk.fulfilled, (state) => {
        state.items = [];
        console.log("✅ Cart cleared from Firestore successfully");
      });
  },
});

export const {
  addItem,
  removeItem,
  incrementQty,
  decrementQty,
  clearCart,
  setCart,
  updateItemExtras
} = cartSlice.actions;

export default cartSlice.reducer;
