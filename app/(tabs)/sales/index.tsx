import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign, TrendingUp, Calendar, Target } from 'lucide-react-native';
import { MainLayout } from '../../../components/MainLayout';
import { MetricCard } from '../../../components/MetricCard';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

export default function SalesScreen() {
  return (
    <MainLayout title="Sales" subtitle="Monitor your sales performance and trends">
      <View style={styles.container}>
        {/* Sales Stats */}
        <View style={styles.statsGrid}>
          <MetricCard
            title="Today's Sales"
            value="£0.00"
            icon={DollarSign}
            iconColor="#10B981"
            style={styles.statCard}
          />
          <MetricCard
            title="This Month"
            value="£0.00"
            icon={Calendar}
            iconColor="#3B82F6"
            style={styles.statCard}
          />
          <MetricCard
            title="Growth Rate"
            value="0%"
            icon={TrendingUp}
            iconColor="#8B5CF6"
            style={styles.statCard}
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Card title="Sales Analytics" style={styles.analyticsCard}>
            <View style={styles.actionButtons}>
              <Button
                title="📈 Sales Report"
                onPress={() => {}}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title="📊 Performance Chart"
                onPress={() => {}}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="🎯 Set Targets"
                onPress={() => {}}
                variant="success"
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.comingSoon}>
              <DollarSign size={48} color="#9CA3AF" />
              <Text style={styles.comingSoonTitle}>Sales Analytics</Text>
              <Text style={styles.comingSoonText}>
                Comprehensive sales tracking, performance analytics, and 
                revenue forecasting tools are being developed.
              </Text>
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  statCard: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  analyticsCard: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 400,
  },
});