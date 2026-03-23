import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  notifications: Notification[];
  cartVisible: boolean;
  searchQuery: string;
  selectedCategory: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

const initialState: UIState = {
  theme: 'light',
  isLoading: false,
  notifications: [],
  cartVisible: false,
  searchQuery: '',
  selectedCategory: 'All',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    toggleCart: (state) => {
      state.cartVisible = !state.cartVisible;
    },
    setCartVisible: (state, action: PayloadAction<boolean>) => {
      state.cartVisible = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  setTheme,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleCart,
  setCartVisible,
  setSearchQuery,
  setSelectedCategory,
} = uiSlice.actions;

export default uiSlice.reducer;
