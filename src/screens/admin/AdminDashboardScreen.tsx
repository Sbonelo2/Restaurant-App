import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, SPACING } from '../../constants';
import { RootState } from '../../store';

interface TabName {
  id: string;
  name: string;
}

const TABS: TabName[] = [
  { id: 'overview', name: 'Overview' },
  { id: 'orders', name: 'Orders' },
  { id: 'menu', name: 'Menu' },
  { id: 'analytics', name: 'Analytics' },
];

type AdminScreenNavigationProp = NativeStackNavigationProp<any>;

const AdminDashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const { orders } = useSelector((state: RootState) => state.orders);
  const { items: foodItems } = useSelector((state: RootState) => state.food);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const availableItems = foodItems.filter(item => item.available).length;

  const renderOverviewTab = () => (
    <View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${totalRevenue.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{deliveredOrders}</Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{foodItems.length}</Text>
          <Text style={styles.statLabel}>Menu Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{availableItems}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}> View Detailed Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}> Manage Restaurant Settings</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrdersTab = () => (
    <View>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Delivered</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders.slice(0, 10)}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.orderDetails}>
                Customer: {item.userName}
              </Text>
              <Text style={styles.orderDetails}>
                Items: {item.items.length} | Total: ${item.total.toFixed(2)}
              </Text>
              <Text style={styles.orderDetails}>
                Address: {item.deliveryAddress}
              </Text>
              <View style={styles.orderActions}>
                <TouchableOpacity style={styles.actionBtnSmall}>
                  <Text style={styles.actionBtnText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnSmall}>
                  <Text style={styles.actionBtnText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  const renderMenuTab = () => (
    <View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Item</Text>
      </TouchableOpacity>

      {foodItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No menu items yet</Text>
        </View>
      ) : (
        <FlatList
          data={foodItems}
          renderItem={({ item }) => (
            <View style={styles.menuItemCard}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.menuItemCategory}>{item.category}</Text>
              </View>
              <View style={styles.menuItemActions}>
                <TouchableOpacity style={styles.menuActionBtn}>
                  <Text style={styles.menuActionBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuActionBtn, styles.deletBtn]}>
                  <Text style={styles.deleteActionBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Order Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}> Chart visualization here</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue Distribution</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartPlaceholderText}> Revenue chart here</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top Items</Text>
        <FlatList
          data={foodItems.slice(0, 5)}
          renderItem={({ item }) => (
            <View style={styles.topItemRow}>
              <Text style={styles.topItemName}>{item.name}</Text>
              <Text style={styles.topItemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.exportSection}>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}> Export Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFC107';
      case 'confirmed':
        return '#0066CC';
      case 'preparing':
        return '#FF6B6B';
      case 'ready':
        return '#51CF66';
      case 'delivered':
        return '#2F9E44';
      default:
        return '#666666';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <FlatList
          data={TABS}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === item.id && styles.activeTab]}
              onPress={() => setActiveTab(item.id)}
            >
              <Text style={[styles.tabText, activeTab === item.id && styles.activeTabText]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'orders' && renderOrdersTab()}
        {activeTab === 'menu' && renderMenuTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  tab: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.lg,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 0.48,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  filterButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.border,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  orderDetails: {
    fontSize: 12,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  orderActions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
  actionBtnSmall: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  actionBtnText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  addButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  menuItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  menuItemCategory: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  menuItemActions: {
    flexDirection: 'row',
  },
  menuActionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  deletBtn: {
    backgroundColor: '#DC3545',
  },
  menuActionBtnText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  deleteActionBtnText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  topItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topItemName: {
    fontSize: 14,
    color: COLORS.text,
  },
  topItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  exportSection: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  exportButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: 8,
  },
  exportButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
