import { configureStore } from "@reduxjs/toolkit";
import adminMenuReducer from "./adminMenuSlice";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import ordersReducer from "./ordersSlice";
import uiReducer from "./uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    adminMenu: adminMenuReducer,
    orders: ordersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['orders/createOrder/fulfilled'],
        // Ignore these field paths in all actions
        ignoredPaths: ['orders.orders.createdAt', 'orders.userOrders.createdAt'],
      },
    }),
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
