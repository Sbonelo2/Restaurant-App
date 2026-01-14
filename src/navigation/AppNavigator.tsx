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
import FoodItemScreen from '../screens/user/FoodItemScreen';
import HomeScreen from '../screens/user/HomeScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ManageFoodScreen from '../screens/admin/ManageFoodScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

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
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="ManageFood" component={ManageFoodScreen} />
            <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
          </>
        ) : (
          // User Stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="FoodItem" component={FoodItemScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
  );
};

export default AppNavigator;
