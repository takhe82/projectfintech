import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package, Plus, Search, Filter } from 'lucide-react-native';
import { MainLayout } from '../../../components/MainLayout';
import { MetricCard } from '../../../components/MetricCard';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

export default function ProductsScreen() {
  return (
    <MainLayout title="Products" subtitle="Manage your product catalog">
      <View style={styles.container}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <MetricCard
            title="Total Products"
            value={6}
            icon={Package}
            iconColor="#3B82F6"
            style={styles.statCard}
          />
          <MetricCard
            title="Active Products"
            value={5}
            icon={Package}
            iconColor="#10B981"
            style={styles.statCard}
          />
          <MetricCard
            title="Out of Stock"
            value={1}
            icon={Package}
            iconColor="#EF4444"
            style={styles.statCard}
          />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Card title="Product Management" style={styles.managementCard}>
            <View style={styles.actionButtons}>
              <Button
                title="➕ Add New Product"
                onPress={() => {}}
                variant="primary"
                style={styles.actionButton}
              />
              <Button
                title="🔍 Search Products"
                onPress={() => {}}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="📊 Export Catalog"
                onPress={() => {}}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.comingSoon}>
              <Package size={48} color="#9CA3AF" />
              <Text style={styles.comingSoonTitle}>Product Management</Text>
              <Text style={styles.comingSoonText}>
                Advanced product catalog management features are coming soon. 
                You'll be able to add, edit, and organize your entire inventory.
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