import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart, Shield } from 'lucide-react-native';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { StatusIndicator } from '../../../components/StatusIndicator';
import { useAuth } from '../../../contexts/AuthContext';
import { processPayment } from '../../../services/walletService';
import { formatCurrency } from '../../../constants/paymentMethods';

export default function PayProductScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [amount, setAmount] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayProduct = async () => {
    if (!productCode.trim() || !quantity || !amount || !merchantEmail.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const paymentAmount = parseFloat(amount);
    const productQuantity = parseInt(quantity);

    if (paymentAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (productQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    if (paymentAmount > (user?.walletBalance || 0)) {
      Alert.alert('Error', 'Insufficient wallet balance');
      return;
    }

    setLoading(true);
    try {
      // In production, you would validate the product exists and get merchant ID
      // For demo purposes, we'll create a demo merchant user if it doesn't exist
      const merchantId = 'demo_merchant_' + merchantEmail.replace(/[^a-zA-Z0-9]/g, '_');
      
      await processPayment(
        user!.id,
        user!.email,
        merchantId,
        merchantEmail.trim(),
        paymentAmount,
        'product_payment',
        productCode.trim(),
        `Product purchase: ${productCode.trim()} (Qty: ${productQuantity})`
      );

      Alert.alert('Success', 'Product payment successful!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Payment Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="← Back"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
          style={styles.backButton}
        />
        <Text style={styles.title}>Buy Products</Text>
        <StatusIndicator status="online" />
      </View>

      <Card>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(user?.walletBalance || 0)}</Text>
        </View>
      </Card>

      <Card title="Product Details">
        <Input
          label="Product Code / SKU"
          value={productCode}
          onChangeText={setProductCode}
          placeholder="Enter product code"
          autoCapitalize="none"
        />

        <Input
          label="Merchant Email"
          value={merchantEmail}
          onChangeText={setMerchantEmail}
          keyboardType="email-address"
          placeholder="Enter merchant email"
          autoCapitalize="none"
        />

        <View style={styles.row}>
          <Input
            label="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="1"
            style={styles.halfInput}
          />

          <Input
            label="Total Amount (Emalangeni)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            style={styles.halfInput}
          />
        </View>

        <Button
          title={loading ? 'Processing Payment...' : `Pay ${amount ? formatCurrency(parseFloat(amount)) : 'for Products'}`}
          onPress={handlePayProduct}
          disabled={loading}
          variant="primary"
          style={styles.payButton}
        />

        <View style={styles.info}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.infoText}>
            🔒 Secure payment with instant product delivery confirmation
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F9FAFB',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  balanceInfo: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  payButton: {
    marginTop: 24,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#065F46',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#A7F3D0',
    marginLeft: 8,
    flex: 1,
  },
});