import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MetricGridProps {
  children: React.ReactNode;
  columns?: number;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ children, columns = 4 }) => {
  return (
    <View style={styles.grid}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 32,
  },
});