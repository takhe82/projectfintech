import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import { Card } from './Card';
import { PAYMENT_METHODS, formatCurrency, calculateFees } from '../constants/paymentMethods';
import { PaymentMethod } from '../types';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onSelectMethod: (methodId: string) => void;
  amount: number;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  amount
}) => {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const renderPaymentMethod = (method: PaymentMethod) => {
    const isSelected = selectedMethod === method.id;
    const isExpanded = expandedMethod === method.id;
    const fees = amount > 0 ? calculateFees(amount, method) : 0;
    const totalAmount = amount + fees;

    return (
      <TouchableOpacity
        key={method.id}
        style={[styles.methodItem, isSelected && styles.selectedMethod]}
        onPress={() => {
          onSelectMethod(method.id);
          setExpandedMethod(isExpanded ? null : method.id);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.methodHeader}>
          <View style={styles.methodInfo}>
            <Text style={styles.methodIcon}>{method.icon}</Text>
            <View style={styles.methodDetails}>
              <Text style={styles.methodName}>{method.name}</Text>
              <Text style={styles.methodType}>
                {method.type === 'mobile_money' ? 'Mobile Money' : 'Bank Transfer'}
              </Text>
              <Text style={styles.processingTime}>
                Processing: {method.processingTime}
              </Text>
            </View>
          </View>
          <View style={styles.methodActions}>
            {amount > 0 && (
              <View style={styles.feeInfo}>
                <Text style={styles.feeText}>Fee: {formatCurrency(fees)}</Text>
                <Text style={styles.totalText}>Total: {formatCurrency(totalAmount)}</Text>
              </View>
            )}
            {isSelected && (
              <View style={styles.checkIcon}>
                <Check size={20} color="#10B981" />
              </View>
            )}
          </View>
        </View>

        {isExpanded && (
          <View style={styles.methodExpanded}>
            <View style={styles.limitInfo}>
              <Text style={styles.limitText}>
                Limits: {formatCurrency(method.minAmount)} - {formatCurrency(method.maxAmount)}
              </Text>
              <Text style={styles.feeStructure}>
                Fees: {formatCurrency(method.fees.fixed)} + {method.fees.percentage}%
              </Text>
            </View>
            {!method.isActive && (
              <Text style={styles.unavailableText}>
                Currently unavailable
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Card title="Select Payment Method">
      <ScrollView style={styles.methodsList} showsVerticalScrollIndicator={false}>
        {PAYMENT_METHODS.filter(method => method.isActive).map(renderPaymentMethod)}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  methodsList: {
    maxHeight: 400,
  },
  methodItem: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMethod: {
    borderColor: '#3B82F6',
    backgroundColor: '#1E3A8A',
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodDetails: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  methodType: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  processingTime: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  methodActions: {
    alignItems: 'flex-end',
  },
  feeInfo: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  feeText: {
    fontSize: 12,
    color: '#F59E0B',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F9FAFB',
    marginTop: 2,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodExpanded: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
  },
  limitInfo: {
    marginBottom: 8,
  },
  limitText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  feeStructure: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  unavailableText: {
    fontSize: 12,
    color: '#EF4444',
    fontStyle: 'italic',
  },
});