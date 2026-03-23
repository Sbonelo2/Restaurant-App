import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sides?: string[];
  drinks?: { id: string; name: string; price: number }[];
  extras?: { id: string; name: string; price: number }[];
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  deliveryAddress?: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  notes?: string;
}

interface OrdersState {
  orders: Order[];
  userOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  userOrders: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const ordersCollection = collection(db, 'orders');
    const snapshot = await getDocs(ordersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: string) => {
    const ordersCollection = collection(db, 'orders');
    const snapshot = await getDocs(ordersCollection);
    const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
    return allOrders.filter(order => order.userId === userId);
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: Timestamp.now(),
    });
    return { id: docRef.id, ...orderData, createdAt: Timestamp.now() };
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }: { orderId: string; status: Order['status'] }) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
    return { orderId, status };
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.userOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders (admin)
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.userOrders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const updateOrder = (order: Order) => 
          order.id === orderId ? { ...order, status } : order;
        
        state.orders = state.orders.map(updateOrder);
        state.userOrders = state.userOrders.map(updateOrder);
      });
  },
});

export const { clearError, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
