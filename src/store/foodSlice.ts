import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  ingredients: string[];
  allergens: string[];
  available: boolean;
}

interface FoodState {
  items: FoodItem[];
  loading: boolean;
  error: string | null;
}

const initialState: FoodState = {
  items: [],
  loading: false,
  error: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    fetchFoodItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFoodItemsSuccess: (state, action: PayloadAction<FoodItem[]>) => {
      state.loading = false;
      state.items = action.payload;
      state.error = null;
    },
    addFoodItem: (state, action: PayloadAction<FoodItem>) => {
      state.items.push(action.payload);
    },
    updateFoodItem: (state, action: PayloadAction<FoodItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteFoodItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const fetchFoodItems = () => (dispatch: any) => {
  dispatch(fetchFoodItemsStart());
  setTimeout(() => {
    const mockData: FoodItem[] = [
      {
        id: '1',
        name: 'Burger',
        description: 'Delicious beef burger',
        price: 12.99,
        category: 'Main Course',
        ingredients: ['Beef', 'Bun', 'Lettuce', 'Tomato'],
        allergens: ['Gluten'],
        available: true,
      },
    ];
    dispatch(fetchFoodItemsSuccess(mockData));
  }, 1000);
};

export const { fetchFoodItemsStart, fetchFoodItemsSuccess, addFoodItem, updateFoodItem, deleteFoodItem } = foodSlice.actions;
export default foodSlice.reducer;