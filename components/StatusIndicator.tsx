import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle, Clock, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'maintenance' | 'error';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: <CheckCircle size={16} color="#10B981" />,
          text: 'Online',
          color: '#10B981',
          bgColor: '#065F46'
        };
      case 'offline':
        return {
          icon: <XCircle size={16} color="#6B7280" />,
          text: 'Offline',
          color: '#6B7280',
          bgColor: '#374151'
        };
      case 'maintenance':
        return {
          icon: <Clock size={16} color="#F59E0B" />,
          text: 'Maintenance',
          color: '#F59E0B',
          bgColor: '#92400E'
        };
      case 'error':
        return {
          icon: <AlertCircle size={16} color="#EF4444" />,
          text: 'Error',
          color: '#EF4444',
          bgColor: '#991B1B'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bgColor }]}>
      {config.icon}
      <Text style={[styles.text, { color: config.color }]}>
        {label || config.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});