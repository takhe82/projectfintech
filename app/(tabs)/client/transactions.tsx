import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Receipt, ShoppingCart, Clock } from 'lucide-react-native';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserTransactions } from '../../../services/walletService';
import { Transaction } from '../../../types';

export default function TransactionsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = getUserTransactions(user.id, setTransactions);
      return unsubscribe;
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp instanceof Date ? timestamp : 
                 (timestamp.toDate ? timestamp.toDate() : new Date(timestamp));
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'top_up':
        return <Plus size={20} color="#10B981" />;
      case 'invoice_payment':
        return <Receipt size={20} color="#EF4444" />;
      case 'product_payment':
        return <ShoppingCart size={20} color="#EF4444" />;
      default:
        return <Clock size={20} color="#9CA3AF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
          style={styles.backButton}
        />
        <Text style={styles.title}>Transaction History</Text>
      </View>

      <Card>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Current Balance</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(user?.walletBalance || 0)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Transactions</Text>
            <Text style={styles.summaryCount}>{transactions.length}</Text>
          </View>
        </View>
      </Card>

      <Card title="All Transactions">
        {transactions.length === 0 ? (
          <Text style={styles.noTransactions}>No transactions found</Text>
        ) : (
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>
                  {transaction.description || transaction.type.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.transactionReference}>
                  Ref: {transaction.reference}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.timestamp)}
                </Text>
                <View style={styles.statusBadge}>
                  <View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(transaction.status) }
                    ]} 
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginTop: 4,
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    textTransform: 'capitalize',
  },
  transactionReference: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
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