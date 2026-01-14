import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface FoodState {
  items: FoodItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: FoodState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
};

// Mock data
const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'Burgers',
    image: 'https://via.placeholder.com/150',
    available: true,
  },
  {
    id: '2',
    name: 'Cheese Pizza',
    description: 'Fresh mozzarella with tomato sauce on crispy crust',
    price: 15.99,
    category: 'Pizza',
    image: 'https://via.placeholder.com/150',
    available: true,
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan and croutons',
    price: 8.99,
    category: 'Salads',
    image: 'https://via.placeholder.com/150',
    available: true,
  },
  {
    id: '4',
    name: 'French Fries',
    description: 'Golden crispy fries with sea salt',
    price: 4.99,
    category: 'Sides',
    image: 'https://via.placeholder.com/150',
    available: true,
  },
];

// Async thunks
export const fetchFoodItems = createAsyncThunk(
  'food/fetchFoodItems',
  async () => {
    // Simulate API call
    return new Promise<FoodItem[]>((resolve) => {
      setTimeout(() => {
        resolve(mockFoodItems);
      }, 1000);
    });
  }
);

export const addFoodItem = createAsyncThunk(
  'food/addFoodItem',
  async (itemData: Omit<FoodItem, 'id'>) => {
    // Simulate API call
    return new Promise<FoodItem>((resolve) => {
      setTimeout(() => {
        const newItem: FoodItem = {
          ...itemData,
          id: Date.now().toString(),
        };
        resolve(newItem);
      }, 500);
    });
  }
);

export const updateFoodItem = createAsyncThunk(
  'food/updateFoodItem',
  async ({ id, ...itemData }: Partial<FoodItem> & { id: string }) => {
    // Simulate API call
    return new Promise<FoodItem>((resolve) => {
      setTimeout(() => {
        const updatedItem: FoodItem = {
          id,
          name: itemData.name || '',
          description: itemData.description || '',
          price: itemData.price || 0,
          category: itemData.category || '',
          image: itemData.image || '',
          available: itemData.available ?? true,
        };
        resolve(updatedItem);
      }, 500);
    });
  }
);

export const deleteFoodItem = createAsyncThunk(
  'food/deleteFoodItem',
  async (itemId: string) => {
    // Simulate API call
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(itemId);
      }, 500);
    });
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch food items
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.categories = Array.from(new Set(action.payload.map(item => item.category)));
        state.error = null;
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch food items';
      })
      // Add food item
      .addCase(addFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        if (!state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
        state.error = null;
      })
      .addCase(addFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add food item';
      })
      // Update food item
      .addCase(updateFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.categories = Array.from(new Set(state.items.map(item => item.category)));
        state.error = null;
      })
      .addCase(updateFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update food item';
      })
      // Delete food item
      .addCase(deleteFoodItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFoodItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.categories = Array.from(new Set(state.items.map(item => item.category)));
        state.error = null;
      })
      .addCase(deleteFoodItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete food item';
      });
  },
});

export const { clearError } = foodSlice.actions;
export default foodSlice.reducer;
