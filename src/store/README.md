# Redux Store Setup for KomEat Restaurant App

## Store Structure

The Redux store is organized into the following slices:

### 1. Auth Slice (`authSlice.ts`)
Manages user authentication state.

```typescript
// Actions
import { setUser, logout, updateUserProfile } from '../store/authSlice';

// Usage in component
import { useAppSelector, useAppDispatch } from '../store/hooks';

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const handleLogin = (userData: User) => {
    dispatch(setUser(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };
};
```

### 2. Cart Slice (`cartSlice.ts`)
Manages shopping cart state and Firestore synchronization.

```typescript
// Actions
import { addItem, removeItem, incrementQty, decrementQty } from '../store/cartSlice';

// Usage
const CartScreen = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);

  const addToCart = (item: CartItem) => {
    dispatch(addItem(item));
  };
};
```

### 3. Orders Slice (`ordersSlice.ts`)
Manages order state with async thunks for Firestore operations.

```typescript
// Async thunks
import { fetchOrders, createOrder, updateOrderStatus } from '../store/ordersSlice';

// Usage
const OrdersScreen = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleCreateOrder = async (orderData) => {
    await dispatch(createOrder(orderData));
  };
};
```

### 4. Admin Menu Slice (`adminMenuSlice.ts`)
Manages restaurant menu items for admin users.

```typescript
// Usage
const ManageMenuScreen = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector(state => state.adminMenu);

  const addMenuItem = async (item: MenuItem) => {
    await dispatch(addMenuItem(item));
  };
};
```

### 5. UI Slice (`uiSlice.ts`)
Manages UI state like theme, notifications, and cart visibility.

```typescript
// Usage
const Header = () => {
  const dispatch = useAppDispatch();
  const { theme, notifications } = useAppSelector(state => state.ui);

  const showNotification = (message: string) => {
    dispatch(addNotification({
      type: 'success',
      title: 'Success',
      message,
    }));
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };
};
```

## Store Configuration

The main store is configured in `src/store/index.ts`:

```typescript
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
        // Ignore Firebase Timestamp serialization
        ignoredActions: ['orders/createOrder/fulfilled'],
        ignoredPaths: ['orders.orders.createdAt', 'orders.userOrders.createdAt'],
      },
    }),
});
```

## TypeScript Support

The store includes full TypeScript support:

```typescript
import type { RootState, AppDispatch } from './store';

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Usage in Components

```typescript
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addItem } from '../store/cartSlice';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);

  const handleAddToCart = () => {
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

## Best Practices

1. **Use typed hooks**: Always use `useAppSelector` and `useAppDispatch` for type safety
2. **Async operations**: Use createAsyncThunk for async operations with Firestore
3. **Normalization**: Keep state normalized for better performance
4. **Serializable check**: Configure serializable check to handle Firebase Timestamps
5. **Error handling**: Include error state in slices and handle errors in components
