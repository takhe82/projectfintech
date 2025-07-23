import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DashboardLayout } from '../../../components/DashboardLayout';

export default function OrdersScreen() {
  return (
    <DashboardLayout title="Orders" subtitle="Manage customer orders">
      <View style={styles.container}>
        <Text style={styles.text}>Order management coming soon</Text>
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