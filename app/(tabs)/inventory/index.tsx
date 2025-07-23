import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart3, TrendingUp, TrendingDown, Package } from 'lucide-react-native';
import { MainLayout } from '../../../components/MainLayout';
import { MetricCard } from '../../../components/MetricCard';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

export default function InventoryScreen() {
  return (
    <MainLayout title="Inventory" subtitle="Track your stock levels and movements">
      <View style={styles.container}>
        {/* Inventory Stats */}
        <View style={styles.statsGrid}>
          <MetricCard
            title="Total Stock Value"
            value="£955.00"
            icon={Package}
            iconColor="#10B981"
            trend={{ value: 5.2, isPositive: true }}
            style={styles.statCard}
          />
          <MetricCard
            title="Items In Stock"
            value={142}
            icon={BarChart3}
            iconColor="#3B82F6"
            style={styles.statCard}
          />
          <MetricCard
            title="Low Stock Items"
            value={5}
            icon={TrendingDown}
            iconColor="#EF4444"
            trend={{ value: 12, isPositive: false }}
            style={styles.statCard}
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Card title="Inventory Management" style={styles.managementCard}>
            <View style={styles.actionButtons}>
              <Button
                title="📦 Stock Adjustment"
                onPress={() => {}}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title="📊 Stock Report"
                onPress={() => {}}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="🔄 Reorder Items"
                onPress={() => {}}
                variant="success"
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.comingSoon}>
              <BarChart3 size={48} color="#9CA3AF" />
              <Text style={styles.comingSoonTitle}>Inventory Tracking</Text>
              <Text style={styles.comingSoonText}>
                Real-time inventory tracking, stock movements, and automated 
                reorder points are being developed for your business.
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
  managementCard: {
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