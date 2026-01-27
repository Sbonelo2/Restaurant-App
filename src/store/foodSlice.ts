import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_FOOD_ITEMS } from '../constants/mockData';

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
  items: MOCK_FOOD_ITEMS,
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
    dispatch(fetchFoodItemsSuccess(MOCK_FOOD_ITEMS));
  }, 500);
};

export const { fetchFoodItemsStart, fetchFoodItemsSuccess, addFoodItem, updateFoodItem, deleteFoodItem } = foodSlice.actions;
export default foodSlice.reducer;
