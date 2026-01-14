import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import DashboardScreen from '../screens/admin/DashboardScreen';
import ManageFoodScreen from '../screens/admin/ManageFoodScreen';
import OrdersScreen from '../screens/admin/OrdersScreen';

export type AdminStackParamList = {
  Dashboard: undefined;
  ManageFood: undefined;
  Orders: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  ManageFood: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const AdminNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'ManageFood') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'list' : 'list-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="ManageFood" 
        component={ManageFoodScreen}
        options={{ title: 'Manage Food' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'Orders' }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
