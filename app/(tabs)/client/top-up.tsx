import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, Smartphone, CreditCard } from 'lucide-react-native';
import { AppLayout } from '../../../components/Layout/AppLayout';
import { ContentContainer } from '../../../components/Layout/ContentContainer';
import { ContentGrid } from '../../../components/UI/ContentGrid';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { PaymentMethodSelector } from '../../../components/PaymentMethodSelector';
import { StatusIndicator } from '../../../components/StatusIndicator';
import { useAuth } from '../../../contexts/AuthContext';
import { processTopUp } from '../../../services/paymentService';
import { formatCurrency } from '../../../constants/paymentMethods';

export default function TopUpScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = [50, 100, 250, 500, 1000, 2500];

  const handleTopUp = async () => {
    const topUpAmount = parseFloat(amount);

    if (!amount || topUpAmount <= 0 || !selectedPaymentMethod) {
      Alert.alert('Error', 'Please enter a valid amount and select a payment method');
      return;
    }

    if (topUpAmount > 50000) {
      Alert.alert('Error', 'Maximum top-up amount is E50,000');
      return;
    }

    // Validate payment method specific requirements
    if (['mtn_momo', 'unayo'].includes(selectedPaymentMethod) && !phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (['fnb', 'swazibank', 'standard_bank', 'nedbank'].includes(selectedPaymentMethod) && !accountNumber.trim()) {
      Alert.alert('Error', 'Please enter your account number');
      return;
    }

    setLoading(true);
    try {
      const reference = `TOPUP_${Date.now()}_${user!.id.substr(0, 8)}`;
      
      const result = await processTopUp({
        userId: user!.id,
        amount: topUpAmount,
        paymentMethod: selectedPaymentMethod,
        phoneNumber: phoneNumber.trim(),
        accountNumber: accountNumber.trim(),
        reference
      });

      if (result.success) {
        Alert.alert('Success', `Successfully topped up ${formatCurrency(topUpAmount)}`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Top-up Failed', result.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const renderPaymentDetails = () => {
    if (!selectedPaymentMethod) return null;

    const isMobileMoney = ['mtn_momo', 'unayo'].includes(selectedPaymentMethod);
    const isBank = ['fnb', 'swazibank', 'standard_bank', 'nedbank'].includes(selectedPaymentMethod);

    return (
      <Card title="Payment Details">
        {isMobileMoney && (
          <Input
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="+268 7612 3456"
          />
        )}
        
        {isBank && (
          <Input
            label="Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            placeholder="Enter your account number"
          />
        )}

        <View style={styles.paymentInfo}>
          <Smartphone size={16} color="#3B82F6" />
          <Text style={styles.paymentInfoText}>
            {isMobileMoney 
              ? 'You will receive a payment prompt on your phone'
              : 'Funds will be debited from your bank account'
            }
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <AppLayout title="Top Up Wallet" subtitle="Add funds to your digital wallet">
      <ContentContainer>
        <ContentGrid>
          {/* Left Column - Amount & Balance */}
          <View style={styles.leftColumn}>
            <Card>
              <View style={styles.currentBalance}>
                <Wallet size={20} color="#3B82F6" />
                <Text style={styles.currentBalanceLabel}>Current Balance</Text>
              </View>
              <Text style={styles.balanceAmount}>{formatCurrency(user?.walletBalance || 0)}</Text>
            </Card>

            <Card title="Top Up Amount">
              <Input
                label="Enter Amount (Emalangeni)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
              />

              <Text style={styles.presetsLabel}>Quick Select</Text>
              <View style={styles.presetGrid}>
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    title={formatCurrency(preset)}
                    onPress={() => setAmount(preset.toString())}
                    variant="secondary"
                    size="small"
                    style={styles.presetButton}
                  />
                ))}
              </View>
            </Card>

            {renderPaymentDetails()}
          </View>

          {/* Right Column - Payment Methods */}
          <View style={styles.rightColumn}>
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={handlePaymentMethodSelect}
              amount={parseFloat(amount) || 0}
            />

            <Card>
              <Button
                title={loading ? 'Processing Top-up...' : 'Top Up Wallet'}
                onPress={handleTopUp}
                disabled={loading || !selectedPaymentMethod || !amount}
                variant="success"
                style={styles.topUpButton}
              />

              <Text style={styles.securityNote}>
                🔒 All transactions are secured with bank-level encryption
              </Text>
            </Card>
          </View>
        </ContentGrid>
      </ContentContainer>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  leftColumn: {
    flex: 1,
    gap: 24,
  },
  rightColumn: {
    flex: 1,
    gap: 24,
  },
  currentBalance: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentBalanceLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  presetsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginTop: 20,
    marginBottom: 12,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  presetButton: {
    width: '30%',
    marginVertical: 4,
  },
  topUpButton: {
    marginTop: 24,
  },
  securityNote: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
  },
  paymentInfoText: {
    fontSize: 12,
    color: '#BFDBFE',
    marginLeft: 8,
    flex: 1,
  },
});