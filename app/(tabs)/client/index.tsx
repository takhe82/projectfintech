import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Plus, Receipt, ShoppingCart, Clock, TrendingUp, Smartphone } from 'lucide-react-native';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { StatusIndicator } from '../../../components/StatusIndicator';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserTransactions } from '../../../services/walletService';
import { formatCurrency } from '../../../constants/paymentMethods';
import { Transaction } from '../../../types';

export default function ClientDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <StatusIndicator status="online" />
        </View>
        <Text style={styles.username}>{user?.displayName || user?.email}</Text>
      </View>

      {/* Wallet Balance Card */}
      <Card style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <View style={styles.balanceIconContainer}>
            <Wallet size={24} color="#3B82F6" />
          </View>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>
          {formatCurrency(user?.walletBalance || 0)}
        </Text>
        <Text style={styles.balanceCurrency}>Emalangeni (SZL)</Text>
        <View style={styles.balanceActions}>
          <Button
            title="💳 Top Up"
            onPress={() => router.push('/(tabs)/client/top-up')}
            variant="success"
            size="small"
            style={styles.actionButton}
          />
          <Button
            title="📊 History"
            onPress={() => router.push('/(tabs)/client/transactions')}
            variant="secondary"
            size="small"
            style={styles.actionButton}
          />
        </View>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
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

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {transactions.length === 0 ? (
          <Text style={styles.noTransactions}>No transactions yet</Text>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.description || transaction.type.replace('_', ' ').toUpperCase()}
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
          ))
        )}
        {transactions.length > 0 && (
          <Button
            title="View All Transactions"
            onPress={() => router.push('/(tabs)/client/transactions')}
            variant="secondary"
            size="small"
            style={styles.viewAllButton}
          />
        )}
      </Card>

      {/* Quick Stats */}
      <Card title="Quick Stats">
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Smartphone size={16} color="#10B981" />
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>
              {formatCurrency(
                transactions
                  .filter(t => {
                    const date = t.timestamp instanceof Date ? t.timestamp : t.timestamp.toDate();
                    const thisMonth = new Date().getMonth();
                    return date.getMonth() === thisMonth;
                  })
                  .reduce((sum, t) => sum + (t.type === 'top_up' ? t.amount : -t.amount), 0)
              )}
            </Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={16} color="#3B82F6" />
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>
              {formatCurrency(
                transactions
                  .filter(t => t.type !== 'top_up')
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginTop: 4,
  },
  balanceCard: {
    marginBottom: 20,
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
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