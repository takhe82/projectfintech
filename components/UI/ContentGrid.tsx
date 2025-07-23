import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ContentGridProps {
  children: React.ReactNode;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ children }) => {
  return (
    <View style={styles.grid}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },
});