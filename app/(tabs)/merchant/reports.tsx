import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChartBar as BarChart3, TrendingUp, Calendar, Users, Receipt } from 'lucide-react-native';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { getMerchantTransactions } from '../../../services/walletService';
import { Transaction } from '../../../types';

export default function MerchantReportsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      const unsubscribe = getMerchantTransactions(user.id, setTransactions);
      return unsubscribe;
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  const getDateRange = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    return { startDate, endDate };
  };

  const getRevenueForPeriod = (days: number) => {
    const { startDate } = getDateRange(days);
    return transactions
      .filter(t => {
        const transactionDate = t.timestamp instanceof Date ? t.timestamp : 
                               (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
        return transactionDate >= startDate;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTransactionsForPeriod = (days: number) => {
    const { startDate } = getDateRange(days);
    return transactions.filter(t => {
      const transactionDate = t.timestamp instanceof Date ? t.timestamp : 
                             (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
      return transactionDate >= startDate;
    }).length;
  };

  const getUniqueCustomersForPeriod = (days: number) => {
    const { startDate } = getDateRange(days);
    const periodTransactions = transactions.filter(t => {
      const transactionDate = t.timestamp instanceof Date ? t.timestamp : 
                             (t.timestamp.toDate ? t.timestamp.toDate() : new Date(t.timestamp));
      return transactionDate >= startDate;
    });
    const uniqueCustomers = new Set(periodTransactions.map(t => t.payerEmail));
    return uniqueCustomers.size;
  };

  const getTopCustomers = () => {
    const customerTotals = transactions.reduce((acc, t) => {
      acc[t.payerEmail] = (acc[t.payerEmail] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(customerTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  };

  const getPaymentMethodBreakdown = () => {
    const breakdown = transactions.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
          style={styles.backButton}
        />
        <Text style={styles.title}>Business Reports</Text>
      </View>

      {/* Revenue Overview */}
      <Card title="Revenue Overview">
        <View style={styles.periodStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>{formatCurrency(getRevenueForPeriod(1))}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>7 Days</Text>
            <Text style={styles.statValue}>{formatCurrency(getRevenueForPeriod(7))}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>30 Days</Text>
            <Text style={styles.statValue}>{formatCurrency(getRevenueForPeriod(30))}</Text>
          </View>
        </View>
      </Card>

      {/* Transaction Stats */}
      <Card title="Transaction Statistics">
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.cardLabel}>Today's Transactions</Text>
              <Text style={styles.cardValue}>{getTransactionsForPeriod(1)}</Text>
            </View>
            <View style={styles.statCard}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.cardLabel}>7-Day Transactions</Text>
              <Text style={styles.cardValue}>{getTransactionsForPeriod(7)}</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Users size={20} color="#F59E0B" />
              <Text style={styles.cardLabel}>Active Customers (7d)</Text>
              <Text style={styles.cardValue}>{getUniqueCustomersForPeriod(7)}</Text>
            </View>
            <View style={styles.statCard}>
              <Receipt size={20} color="#8B5CF6" />
              <Text style={styles.cardLabel}>Total Transactions</Text>
              <Text style={styles.cardValue}>{transactions.length}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Top Customers */}
      <Card title="Top Customers">
        {getTopCustomers().length === 0 ? (
          <Text style={styles.noData}>No customer data available</Text>
        ) : (
          getTopCustomers().map(([customer, total], index) => (
            <View key={customer} style={styles.customerItem}>
              <View style={styles.customerRank}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerEmail}>{customer}</Text>
              </View>
              <Text style={styles.customerTotal}>{formatCurrency(total)}</Text>
            </View>
          ))
        )}
      </Card>

      {/* Payment Methods */}
      <Card title="Payment Methods">
        {getPaymentMethodBreakdown().length === 0 ? (
          <Text style={styles.noData}>No payment data available</Text>
        ) : (
          getPaymentMethodBreakdown().map(([method, count]) => (
            <View key={method} style={styles.methodItem}>
              <Text style={styles.methodName}>
                {method.replace('_', ' ').toUpperCase()}
              </Text>
              <Text style={styles.methodCount}>{count} transactions</Text>
            </View>
          ))
        )}
      </Card>

      <Card>
        <View style={styles.exportSection}>
          <BarChart3 size={24} color="#3B82F6" />
          <Text style={styles.exportText}>
            Export detailed reports and analytics coming soon
          </Text>
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
    paddingBottom: 20,
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
  periodStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#374151',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  customerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  customerInfo: {
    flex: 1,
  },
  customerEmail: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  customerTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  methodName: {
    fontSize: 14,
    color: '#F9FAFB',
    fontWeight: '500',
  },
  methodCount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  exportSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  exportText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  noData: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    padding: 20,
  },
});