import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, TrendingUp, Users, Receipt, Package, DollarSign, TrendingDown, ShoppingCart } from 'lucide-react-native';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { ContentContainer } from '../../../components/Layout/ContentContainer';
import { MetricGrid } from '../../../components/UI/MetricGrid';
import { ContentGrid } from '../../../components/UI/ContentGrid';
import { MetricCard } from '../../../components/MetricCard';
import { AlertPanel } from '../../../components/AlertPanel';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { getMerchantTransactions } from '../../../services/walletService';
import { formatCurrency } from '../../../constants/paymentMethods';
import { Transaction } from '../../../types';

export default function MerchantDashboard() {
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
      const unsubscribe = getMerchantTransactions(user.id, (merchantTransactions) => {
        setTransactions(merchantTransactions.slice(0, 5));
      });
      return unsubscribe;
    }
  }, [user]);

  const getTodaysRevenue = () => {
    const today = new Date().toDateString();
    return transactions
      .filter(t => {
        const date = t.timestamp instanceof Date ? t.timestamp : 
                     (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
        const transactionDate = date.toDateString();
        return transactionDate === today;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getUniqueCustomers = () => {
    const uniqueCustomers = new Set(transactions.map(t => t.payerEmail));
    return uniqueCustomers.size;
  };

  return (
    <AppLayout title="Business Dashboard" subtitle="Monitor your business performance and growth">
      <ContentContainer>
        {/* Metrics Grid */}
        <MetricGrid>
          <MetricCard
            title="Total Products"
            value={dashboardData.totalProducts}
            icon={Package}
            iconColor="#3B82F6"
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Inventory Value"
            value={formatCurrency(dashboardData.inventoryValue)}
            icon={DollarSign}
            iconColor="#10B981"
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Today's Revenue"
            value={formatCurrency(getTodaysRevenue())}
            icon={TrendingUp}
            iconColor="#F59E0B"
          />
          <MetricCard
            title="Active Customers"
            value={getUniqueCustomers()}
            icon={Users}
            iconColor="#8B5CF6"
          />
        </MetricGrid>

        {/* Content Grid */}
        <ContentGrid>
          {/* Alert Panel */}
          <View style={styles.alertSection}>
            <AlertPanel 
              items={lowStockItems}
              onViewAll={() => router.push('/(tabs)/low-stock')}
            />
          </View>

          {/* Business Tools */}
          <Card title="Business Tools" style={styles.businessToolsCard}>
            <View style={styles.toolButtonsGrid}>
              <Button
                title="📦 Manage Products"
                onPress={() => router.push('/(tabs)/products')}
                variant="primary"
                style={styles.toolButton}
              />
              <Button
                title="📊 View Reports"
                onPress={() => router.push('/(tabs)/merchant/reports')}
                variant="secondary"
                style={styles.toolButton}
              />
              <Button
                title="💰 All Payments"
                onPress={() => router.push('/(tabs)/merchant/transactions')}
                variant="success"
                style={styles.toolButton}
              />
              <Button
                title="📈 Sales Analytics"
                onPress={() => router.push('/(tabs)/sales')}
                variant="secondary"
                style={styles.toolButton}
              />
            </View>
          </Card>

          {/* Recent Payments */}
          <Card title="Recent Payments" style={styles.recentPaymentsCard}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Receipt size={48} color="#64748B" />
                <Text style={styles.emptyStateTitle}>No Payments Yet</Text>
                <Text style={styles.emptyStateText}>
                  Customer payments will appear here
                </Text>
              </View>
            ) : (
              <View style={styles.paymentsList}>
                {transactions.map((transaction) => (
                  <View key={transaction.id} style={styles.paymentItem}>
                    <View style={styles.paymentIcon}>
                      <Receipt size={16} color="#10B981" />
                    </View>
                    <View style={styles.paymentInfo}>
                      <Text style={styles.paymentCustomer}>
                        {transaction.payerEmail}
                      </Text>
                      <Text style={styles.paymentDescription}>
                        {transaction.description || transaction.type.replace('_', ' ')}
                      </Text>
                      <Text style={styles.paymentDate}>
                        {(transaction.timestamp instanceof Date ? 
                          transaction.timestamp : 
                          transaction.timestamp.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.paymentAmount}>
                      +{formatCurrency(transaction.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </ContentGrid>
      </ContentContainer>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  alertSection: {
    flex: 1,
  },
  businessToolsCard: {
    flex: 1,
  },
  recentPaymentsCard: {
    flex: 1,
  },
  toolButtonsGrid: {
    gap: 12,
  },
  toolButton: {
    marginVertical: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  paymentsList: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
  },
  paymentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentCustomer: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});