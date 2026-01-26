import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// User Screens
import CartScreen from '../screens/user/CartScreen';
import CheckoutScreen from '../screens/user/CheckoutScreen';
import HomeScreen from '../screens/user/HomeScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import ViewItemScreen from '../screens/user/ViewItemScreen';

// Admin Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import ManageFoodScreen from '../screens/admin/ManageFoodScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : user?.role === 'admin' ? (
          // Admin Stack
          <>
            <Stack.Screen name="AdminDashboard" component={DashboardScreen} />
            <Stack.Screen name="ManageFood" component={ManageFoodScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
          </>
        ) : (
          // User Stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ViewItem" component={ViewItemScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
  );
};

export default AppNavigator;
