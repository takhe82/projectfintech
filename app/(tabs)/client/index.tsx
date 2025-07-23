import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Plus, Receipt, ShoppingCart, TrendingUp, Package, DollarSign, TrendingDown } from 'lucide-react-native';
import { MainLayout } from '../../../components/MainLayout';
import { MetricCard } from '../../../components/MetricCard';
import { AlertPanel } from '../../../components/AlertPanel';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserTransactions } from '../../../services/walletService';
import { formatCurrency } from '../../../constants/paymentMethods';
import { Transaction } from '../../../types';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
    { id: '3', name: 'Office Supplies', sku: '12345678', currentStock: 1, minStock: 5 },
  ];

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserTransactions(user.id, (userTransactions) => {
        setTransactions(userTransactions.slice(0, 5));
      });
      return unsubscribe;
    }
  }, [user]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top_up':
        return <Plus size={16} color="#10B981" />;
      case 'invoice_payment':
        return <Receipt size={16} color="#EF4444" />;
      case 'product_payment':
        return <ShoppingCart size={16} color="#EF4444" />;
      default:
        return <Wallet size={16} color="#9CA3AF" />;
    }
  };

  return (
    <MainLayout title="Dashboard" subtitle="Welcome to your inventory management system">
      <View style={styles.container}>
        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            title="Total Products"
            value={dashboardData.totalProducts}
            icon={Package}
            iconColor="#3B82F6"
            trend={{ value: 12, isPositive: true }}
            style={styles.metricCard}
          />
          <MetricCard
            title="Inventory Value"
            value={`£${dashboardData.inventoryValue.toFixed(2)}`}
            icon={DollarSign}
            iconColor="#10B981"
            trend={{ value: 8, isPositive: true }}
            style={styles.metricCard}
          />
          <MetricCard
            title="Low Stock Items"
            value={dashboardData.lowStockItems}
            icon={TrendingDown}
            iconColor="#EF4444"
            trend={{ value: 15, isPositive: false }}
            style={styles.metricCard}
          />
          <MetricCard
            title="Today's Sales"
            value={`£${dashboardData.todaysSales.toFixed(2)}`}
            icon={ShoppingCart}
            iconColor="#8B5CF6"
            style={styles.metricCard}
          />
        </View>

        {/* Content Grid */}
        <View style={styles.contentGrid}>
          {/* Alert Panel */}
          <View style={styles.alertSection}>
            <AlertPanel 
              items={lowStockItems}
              onViewAll={() => router.push('/(tabs)/low-stock')}
            />
          </View>

          {/* Quick Actions */}
          <Card title="Quick Actions" style={styles.actionsCard}>
            <View style={styles.actionsGrid}>
              <Button
                title="💳 Top Up Wallet"
                onPress={() => router.push('/(tabs)/client/top-up')}
                variant="success"
                style={styles.actionButton}
              />
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
              <Button
                title="📊 View Transactions"
                onPress={() => router.push('/(tabs)/client/transactions')}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </Card>

          {/* Recent Transactions */}
          <Card title="Recent Activity" style={styles.transactionsCard}>
            {transactions.length === 0 ? (
              <Text style={styles.noTransactions}>No recent transactions</Text>
            ) : (
              <View style={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionIcon}>
                      {getTransactionIcon(transaction.type)}
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description || transaction.type.replace('_', ' ')}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {(transaction.timestamp instanceof Date ? 
                          transaction.timestamp : 
                          transaction.timestamp.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={[
                      styles.transactionAmount,
                      transaction.type === 'top_up' ? styles.positive : styles.negative
                    ]}>
                      {transaction.type === 'top_up' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </View>
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  metricCard: {
    flex: 1,
  },
  contentGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
  alertSection: {
    flex: 1,
  },
  actionsCard: {
    flex: 1,
  },
  transactionsCard: {
    flex: 1,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#374151',
    borderRadius: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1F2937',
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
});