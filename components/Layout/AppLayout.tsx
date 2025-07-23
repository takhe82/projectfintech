import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LeftSidebar } from './LeftSidebar';
import { TopHeader } from './TopHeader';
import { useAuth } from '../../contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <LeftSidebar />
      <View style={styles.mainContent}>
        <TopHeader title={title} subtitle={subtitle} />
        <View style={styles.contentArea}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    height: screenHeight,
    width: screenWidth,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    minHeight: screenHeight,
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
  },
});