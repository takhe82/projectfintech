import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LeftSidebar } from './LeftSidebar';
import { TopBar } from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <View style={styles.container}>
      <LeftSidebar />
      <View style={styles.mainContent}>
        <TopBar title={title} subtitle={subtitle} />
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
    backgroundColor: '#111827',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
});