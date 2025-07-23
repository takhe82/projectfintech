import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Plus, Receipt, ShoppingCart, TrendingUp, Package, DollarSign, TrendingDown } from 'lucide-react-native';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { ContentContainer } from '../../../components/Layout/ContentContainer';
import { MetricGrid } from '../../../components/UI/MetricGrid';
import { ContentGrid } from '../../../components/UI/ContentGrid';
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

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserTransactions(user.id, (userTransactions) => {
        setTransactions(userTransactions.slice(0, 5));
      });
      return unsubscribe;
    }
  }, [user]);

  const getTodaysTransactions = () => {
    const today = new Date().toDateString();
    return transactions.filter(t => {
      const date = t.timestamp instanceof Date ? t.timestamp : 
                   (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
      return date.toDateString() === today;
    }).length;
  };

  const getTodaysSpending = () => {
    const today = new Date().toDateString();
    return transactions
      .filter(t => {
        const date = t.timestamp instanceof Date ? t.timestamp : 
                     (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
        return date.toDateString() === today && t.type !== 'top_up';
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlySpending = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions
      .filter(t => {
        const date = t.timestamp instanceof Date ? t.timestamp : 
                     (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
        return date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear && 
               t.type !== 'top_up';
      })
      .reduce((sum, t) => sum + t.amount, 0);
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
        return <Wallet size={16} color="#9CA3AF" />;
    }
  };

  return (
    <AppLayout title="Client Dashboard" subtitle="Manage your digital wallet and payments">
      <ContentContainer>
        {/* Metrics Grid */}
        <MetricGrid>
          <MetricCard
            title="Wallet Balance"
            value={formatCurrency(user?.walletBalance || 0)}
            icon={Wallet}
            iconColor="#3B82F6"
          />
          <MetricCard
            title="Today's Transactions"
            value={getTodaysTransactions()}
            icon={Activity}
            iconColor="#10B981"
          />
          <MetricCard
            title="Today's Spending"
            value={formatCurrency(getTodaysSpending())}
            icon={Receipt}
            iconColor="#F59E0B"
          />
          <MetricCard
            title="Monthly Spending"
            value={formatCurrency(getMonthlySpending())}
            icon={TrendingDown}
            iconColor="#8B5CF6"
          />
        </MetricGrid>

        {/* Content Grid */}
        <ContentGrid>
          {/* Quick Actions */}
          <Card title="Quick Actions" style={styles.quickActionsCard}>
            <View style={styles.actionButtonsGrid}>
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
          <Card title="Recent Activity" style={styles.recentActivityCard}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Wallet size={48} color="#64748B" />
                <Text style={styles.emptyStateTitle}>No Recent Activity</Text>
                <Text style={styles.emptyStateText}>
                  Your recent transactions will appear here
                </Text>
              </View>
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
        </ContentGrid>
      </ContentContainer>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  quickActionsCard: {
    flex: 1,
  },
  recentActivityCard: {
    flex: 1,
  },
  actionButtonsGrid: {
    gap: 12,
  },
  actionButton: {
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
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#334155',
    borderRadius: 12,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
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
    color: '#F8FAFC',
    textTransform: 'capitalize',
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
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
});