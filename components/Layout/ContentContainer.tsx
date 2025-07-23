import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ContentContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({ 
  children, 
  style,
  padding = true 
}) => {
  return (
    <View style={[
      styles.container, 
      padding && styles.withPadding,
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  withPadding: {
    padding: 32,
  },
});