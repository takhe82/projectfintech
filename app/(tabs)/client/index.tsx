import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, RefreshControl, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Plus, Receipt, ShoppingCart, Clock, TrendingUp, Smartphone, Package, TrendingDown, DollarSign, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Button } from '../../../components/Button';
import { DashboardLayout } from '../../../components/DashboardLayout';
import { DashboardCard } from '../../../components/DashboardCard';
import { AlertCard } from '../../../components/AlertCard';
import { Card } from '../../../components/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserTransactions } from '../../../services/walletService';
import { formatCurrency } from '../../../constants/paymentMethods';
import { Transaction } from '../../../types';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for dashboard
  const dashboardData = {
    totalProducts: 6,
    inventoryValue: 955.00,
    lowStockItems: 5,
    todaysSales: 0.00
  };

  const lowStockItems = [
    { id: '1', name: '1 QUIRE', sku: '04417484', currentStock: 2, minStock: 10 },
    { id: '2', name: '1 quire', sku: '6009631870000', currentStock: 2, minStock: 10 },
  ];

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserTransactions(user.id, (userTransactions) => {
        setTransactions(userTransactions.slice(0, 5)); // Show last 5 transactions
      });
      return unsubscribe;
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top_up':
        return <Plus size={16} color="#10B981" />;
      case 'invoice_payment':
        return <Receipt size={16} color="#EF4444" />;
      case 'product_payment':
        return <ShoppingCart size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#9CA3AF" />;
    }
  };

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Welcome to your inventory management system"
    >
      <FlatList
        style={styles.container}
        data={[{ key: 'dashboard' }]}
        renderItem={() => (
          <View style={styles.content}>
            {/* Dashboard Cards Grid */}
            <View style={styles.cardsGrid}>
              <View style={styles.cardRow}>
                <DashboardCard
                  title="Total Products"
                  value={dashboardData.totalProducts}
                  icon={Package}
                  iconColor="#3B82F6"
                  style={styles.card}
                />
                <DashboardCard
                  title="Inventory Value"
                  value={`£${dashboardData.inventoryValue.toFixed(2)}`}
                  icon={DollarSign}
                  iconColor="#10B981"
                  style={styles.card}
                />
              </View>
              
              <View style={styles.cardRow}>
                <DashboardCard
                  title="Low Stock Items"
                  value={dashboardData.lowStockItems}
                  icon={TrendingDown}
                  iconColor="#EF4444"
                  style={styles.card}
                />
                <DashboardCard
                  title="Today's Sales"
                  value={`£${dashboardData.todaysSales.toFixed(2)}`}
                  icon={ShoppingCart}
                  iconColor="#8B5CF6"
                  style={styles.card}
                />
              </View>
            </View>

            {/* Low Stock Alert */}
            <AlertCard
              title="Low Stock Alert"
              items={lowStockItems}
            />

            {/* Quick Actions */}
            <Card title="Quick Actions">
              <View style={styles.actionsGrid}>
                <Button
                  title="💳 Top Up Wallet"
                  onPress={() => router.push('/(tabs)/client/top-up')}
                  variant="success"
                  style={styles.actionButton}
                />
                <Button
                  title="📊 View Transactions"
                  onPress={() => router.push('/(tabs)/client/transactions')}
                  variant="secondary"
                  style={styles.actionButton}
                />
              </View>
              <View style={styles.actionsGrid}>
                <Button
                  title="📄 Pay Invoice"
                  onPress={() => router.push('/(tabs)/client/pay-invoice')}
                  variant="primary"
                  style={styles.actionButton}
                />
                <Button
                  title="🛒 Buy Products"
                  onPress={() => router.push('/(tabs)/client/pay-product')}
                  variant="primary"
                  style={styles.actionButton}
                />
              </View>
            </Card>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardsGrid: {
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    marginHorizontal: 6,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  positive: {
    color: '#10B981',
  },
  negative: {
    color: '#EF4444',
  },
  noTransactions: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    padding: 20,
  },
  viewAllButton: {
    marginTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
});