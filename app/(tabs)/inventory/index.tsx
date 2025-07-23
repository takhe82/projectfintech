import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DashboardLayout } from '../../../components/DashboardLayout';

export default function InventoryScreen() {
  return (
    <DashboardLayout title="Inventory" subtitle="Track your stock levels">
      <View style={styles.container}>
        <Text style={styles.text}>Inventory management coming soon</Text>
      </View>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#9CA3AF',
    fontSize: 16,
  },
});