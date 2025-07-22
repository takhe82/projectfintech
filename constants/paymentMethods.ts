import { PaymentMethod } from '../types';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'mtn_momo',
    name: 'MTN MoMo',
    type: 'mobile_money',
    icon: '📱',
    isActive: true,
    minAmount: 5,
    maxAmount: 50000,
    fees: {
      fixed: 2,
      percentage: 0.5
    },
    processingTime: 'Instant'
  },
  {
    id: 'unayo',
    name: 'Unayo',
    type: 'mobile_money',
    icon: '💳',
    isActive: true,
    minAmount: 10,
    maxAmount: 25000,
    fees: {
      fixed: 1.5,
      percentage: 0.3
    },
    processingTime: 'Instant'
  },
  {
    id: 'fnb',
    name: 'FNB Eswatini',
    type: 'bank',
    icon: '🏦',
    isActive: true,
    minAmount: 50,
    maxAmount: 100000,
    fees: {
      fixed: 5,
      percentage: 0.2
    },
    processingTime: '1-2 hours'
  },
  {
    id: 'swazibank',
    name: 'SwaziBank',
    type: 'bank',
    icon: '🏛️',
    isActive: true,
    minAmount: 50,
    maxAmount: 100000,
    fees: {
      fixed: 4,
      percentage: 0.25
    },
    processingTime: '1-2 hours'
  },
  {
    id: 'standard_bank',
    name: 'Standard Bank',
    type: 'bank',
    icon: '🏦',
    isActive: true,
    minAmount: 50,
    maxAmount: 150000,
    fees: {
      fixed: 6,
      percentage: 0.15
    },
    processingTime: '2-4 hours'
  },
  {
    id: 'nedbank',
    name: 'Nedbank',
    type: 'bank',
    icon: '🏛️',
    isActive: true,
    minAmount: 50,
    maxAmount: 120000,
    fees: {
      fixed: 5.5,
      percentage: 0.2
    },
    processingTime: '1-3 hours'
  }
];

export const formatCurrency = (amount: number): string => {
  return `E${amount.toFixed(2)}`;
};

export const calculateFees = (amount: number, paymentMethod: PaymentMethod): number => {
  const percentageFee = (amount * paymentMethod.fees.percentage) / 100;
  return paymentMethod.fees.fixed + percentageFee;
};

export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return PAYMENT_METHODS.find(method => method.id === id);
};