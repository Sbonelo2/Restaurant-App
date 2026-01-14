import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchFoodItems } from '../../store/foodSlice';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalFoodItems: number;
  pendingOrders: number;
  completedOrders: number;
}

const AdminDashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 156,
    totalRevenue: 4589.50,
    totalUsers: 89,
    totalFoodItems: 24,
    pendingOrders: 12,
    completedOrders: 144,
  });
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { items: foodItems } = useSelector((state: RootState) => state.food);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFoodItems() as any);
  }, [dispatch]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalFoodItems: foodItems.length,
    }));
  }, [foodItems]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call to refresh stats
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        totalOrders: Math.floor(Math.random() * 200) + 100,
        totalRevenue: Math.floor(Math.random() * 5000) + 2000,
        totalUsers: Math.floor(Math.random() * 100) + 50,
        totalFoodItems: foodItems.length,
        pendingOrders: Math.floor(Math.random() * 20) + 5,
        completedOrders: Math.floor(Math.random() * 150) + 100,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string; color: string }> = 
    ({ title, value, subtitle, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const QuickAction: React.FC<{ title: string; icon: string; onPress: () => void; color: string }> = 
    ({ title, icon, onPress, color }) => (
    <TouchableOpacity style={[styles.quickAction, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user?.name}!</Text>
        <Text style={styles.subtitleText}>Here's your restaurant overview</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`${stats.pendingOrders} pending`}
          color="#FF6B6B"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          subtitle="This month"
          color="#4ECDC4"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Active customers"
          color="#45B7D1"
        />
        <StatCard
          title="Food Items"
          value={stats.totalFoodItems}
          subtitle="In menu"
          color="#96CEB4"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            title="Manage Food"
            icon="🍔"
            onPress={() => navigation.navigate('ManageFood')}
            color="#FF6B6B"
          />
          <QuickAction
            title="Orders"
            icon="📋"
            onPress={() => navigation.navigate('OrderManagement')}
            color="#4ECDC4"
          />
          <QuickAction
            title="Analytics"
            icon="📊"
            onPress={() => Alert.alert('Coming Soon', 'Analytics feature coming soon!')}
            color="#45B7D1"
          />
          <QuickAction
            title="Settings"
            icon="⚙️"
            onPress={() => Alert.alert('Coming Soon', 'Settings feature coming soon!')}
            color="#96CEB4"
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={handleRefresh} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FF6B6B" />
            ) : (
              <Text style={styles.refreshText}>Refresh</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>📦</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New order received</Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
            <Text style={styles.activityValue}>Order #1234</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>👤</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New user registered</Text>
              <Text style={styles.activityTime}>15 minutes ago</Text>
            </View>
            <Text style={styles.activityValue}>john.doe@email.com</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Order completed</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
            <Text style={styles.activityValue}>Order #1233</Text>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>🍔</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New food item added</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityValue}>Deluxe Burger</Text>
          </View>
        </View>
      </View>

      {/* Performance Chart Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sales Overview</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}>📊</Text>
          <Text style={styles.chartPlaceholderSubtext}>Sales analytics coming soon</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginRight: '1%',
    marginLeft: '1%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  refreshText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  activityValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  chartPlaceholderSubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default AdminDashboardScreen;
