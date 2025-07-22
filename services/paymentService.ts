import { doc, updateDoc, increment, addDoc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction, TopUpRequest, PaymentMethod } from '../types';
import { PAYMENT_METHODS, calculateFees, getPaymentMethodById } from '../constants/paymentMethods';

// Simulate payment gateway integration
export const processTopUp = async (request: TopUpRequest): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    const paymentMethod = getPaymentMethodById(request.paymentMethod);
    if (!paymentMethod) {
      throw new Error('Invalid payment method');
    }

    // Validate amount limits
    if (request.amount < paymentMethod.minAmount || request.amount > paymentMethod.maxAmount) {
      throw new Error(`Amount must be between E${paymentMethod.minAmount} and E${paymentMethod.maxAmount}`);
    }

    // Calculate fees
    const fees = calculateFees(request.amount, paymentMethod);
    const totalAmount = request.amount + fees;

    // Simulate payment processing based on method
    const paymentResult = await simulatePaymentGateway(request, paymentMethod);
    
    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Payment failed');
    }

    // Process the top-up in Firestore
    const transactionId = await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', request.userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      // Update user balance
      transaction.update(userRef, {
        walletBalance: increment(request.amount)
      });

      // Create transaction record
      const transactionData: Omit<Transaction, 'id'> = {
        payerId: request.userId,
        payerEmail: userDoc.data().email,
        receiverId: request.userId,
        receiverEmail: userDoc.data().email,
        amount: request.amount,
        type: 'top_up',
        reference: request.reference,
        status: 'completed',
        timestamp: new Date(),
        description: `Top-up via ${paymentMethod.name}`,
        paymentMethod: request.paymentMethod as any,
        externalReference: paymentResult.externalReference,
        fees
      };

      const transactionRef = doc(collection(db, 'transactions'));
      transaction.set(transactionRef, {
        ...transactionData,
        timestamp: serverTimestamp()
      });

      return transactionRef.id;
    });

    return { success: true, transactionId };
  } catch (error: any) {
    console.error('Top-up error:', error);
    return { success: false, error: error.message };
  }
};

// Simulate different payment gateways
const simulatePaymentGateway = async (
  request: TopUpRequest, 
  paymentMethod: PaymentMethod
): Promise<{ success: boolean; externalReference?: string; error?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate different success rates for different methods
  const successRates = {
    mtn_momo: 0.95,
    unayo: 0.92,
    fnb: 0.98,
    swazibank: 0.96,
    standard_bank: 0.97,
    nedbank: 0.95
  };

  const successRate = successRates[request.paymentMethod as keyof typeof successRates] || 0.9;
  const isSuccessful = Math.random() < successRate;

  if (!isSuccessful) {
    const errors = [
      'Insufficient funds',
      'Network timeout',
      'Invalid account details',
      'Service temporarily unavailable'
    ];
    return {
      success: false,
      error: errors[Math.floor(Math.random() * errors.length)]
    };
  }

  // Generate mock external reference
  const externalReference = `${paymentMethod.id.toUpperCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    success: true,
    externalReference
  };
};

// MTN MoMo specific integration
export const processMTNMoMoPayment = async (
  phoneNumber: string,
  amount: number,
  reference: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Validate phone number format (Eswatini MTN format)
    const phoneRegex = /^(\+268|268|0)?[67]\d{7}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error('Invalid MTN phone number format');
    }

    // Simulate MTN MoMo API call
    const response = await fetch('/api/mtn-momo/request-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.MTN_MOMO_API_KEY
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'SZL',
        externalId: reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.replace(/^\+?268/, '')
        },
        payerMessage: 'PayFlow wallet top-up',
        payeeNote: 'Wallet funding'
      })
    });

    if (!response.ok) {
      throw new Error('MTN MoMo payment request failed');
    }

    const result = await response.json();
    return {
      success: true,
      transactionId: result.referenceId
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Unayo payment integration
export const processUnayoPayment = async (
  phoneNumber: string,
  amount: number,
  reference: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Simulate Unayo API integration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful payment
    return {
      success: true,
      transactionId: `UNAYO_${Date.now()}`
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Bank transfer integration
export const processBankTransfer = async (
  bankId: string,
  accountNumber: string,
  amount: number,
  reference: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    // Validate account number format
    if (accountNumber.length < 8 || accountNumber.length > 12) {
      throw new Error('Invalid account number format');
    }

    // Simulate bank API integration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      transactionId: `${bankId.toUpperCase()}_${Date.now()}`
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};