import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Search, Settings, User } from 'lucide-react-native';
import { StatusIndicator } from './StatusIndicator';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../constants/paymentMethods';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <View style={styles.topBar}>
      <View style={styles.leftSection}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.rightSection}>
        {user && (
          <View style={styles.walletInfo}>
            <Text style={styles.walletLabel}>Balance</Text>
            <Text style={styles.walletAmount}>{formatCurrency(user.walletBalance)}</Text>
          </View>
        )}
        
        <StatusIndicator status="online" />
        
        <TouchableOpacity style={styles.iconButton}>
          <Search size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={20} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileButton}>
          <User size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 70,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  leftSection: {
    flex: 1,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  walletInfo: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  walletLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  walletAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
});