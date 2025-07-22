import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, TrendingUp, Users, Clock, Receipt, ChartBar as BarChart3, Building2 } from 'lucide-react-native';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { StatusIndicator } from '../../../components/StatusIndicator';
import { useAuth } from '../../../contexts/AuthContext';
import { getMerchantTransactions } from '../../../services/walletService';
import { formatCurrency } from '../../../constants/paymentMethods';
import { Transaction } from '../../../types';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = getMerchantTransactions(user.id, (merchantTransactions) => {
        setTransactions(merchantTransactions.slice(0, 5)); // Show last 5 transactions
      });
      return unsubscribe;
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'invoice_payment':
        return <Receipt size={16} color="#10B981" />;
      case 'product_payment':
        return <TrendingUp size={16} color="#10B981" />;
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
          <Building2 size={24} color="#3B82F6" />
          <Text style={styles.greeting}>Business Dashboard</Text>
          <StatusIndicator status="online" />
        </View>
        <Text style={styles.username}>{user?.displayName || user?.email}</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <Wallet size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statLabel}>Wallet Balance</Text>
          </View>
          <Text style={styles.statValue}>{formatCurrency(user?.walletBalance || 0)}</Text>
          <Text style={styles.statCurrency}>Emalangeni</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={20} color="#10B981" />
            </View>
            <Text style={styles.statLabel}>Today's Revenue</Text>
          </View>
          <Text style={styles.statValue}>{formatCurrency(getTodaysRevenue())}</Text>
          <Text style={styles.statCurrency}>Today</Text>
        </Card>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <Receipt size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statLabel}>Total Transactions</Text>
          </View>
          <Text style={styles.statCount}>{transactions.length}</Text>
          <Text style={styles.statCurrency}>All Time</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statHeader}>
            <View style={styles.statIconContainer}>
              <Users size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.statLabel}>Unique Customers</Text>
          </View>
          <Text style={styles.statCount}>{getUniqueCustomers()}</Text>
          <Text style={styles.statCurrency}>Active</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card title="Business Tools">
        <View style={styles.actionsGrid}>
          <Button
            title="💰 All Transactions"
            onPress={() => router.push('/(tabs)/merchant/transactions')}
            variant="primary"
            style={styles.actionButton}
          />
          <Button
            title="📊 Reports"
            onPress={() => router.push('/(tabs)/merchant/reports')}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>
      </Card>

      {/* Recent Payments */}
      <Card title="Recent Payments">
        {transactions.length === 0 ? (
          <Text style={styles.noTransactions}>No payments received yet</Text>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionCustomer}>
                  From: {transaction.payerEmail}
                </Text>
                <Text style={styles.transactionDescription}>
                  {transaction.description || transaction.type.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.transactionDate}>
                  {(transaction.timestamp instanceof Date ? 
                    transaction.timestamp : 
                    transaction.timestamp.toDate()).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.transactionAmount}>
                +{formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))
        )}
        {transactions.length > 0 && (
          <Button
            title="View All Payments"
            onPress={() => router.push('/(tabs)/merchant/transactions')}
            variant="secondary"
            size="small"
            style={styles.viewAllButton}
          />
        )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F9FAFB',
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statCurrency: {
    fontSize: 10,
    color: '#6B7280',
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
  transactionCustomer: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  transactionDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
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
});