import { doc, updateDoc, increment, addDoc, collection, query, where, orderBy, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction } from '../types';

export const topUpWallet = async (userId: string, amount: number): Promise<void> => {
  try {
    // Simulate top-up (in production, this would integrate with payment gateway)
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      walletBalance: increment(amount)
    });

    // Record transaction
    const transaction: Omit<Transaction, 'id'> = {
      payerId: userId,
      payerEmail: 'system',
      receiverId: userId,
      receiverEmail: 'system',
      amount,
      type: 'top_up',
      reference: `TOP_${Date.now()}`,
      status: 'completed',
      timestamp: new Date(),
      description: 'Wallet Top-up'
    };

    await addDoc(collection(db, 'transactions'), transaction);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const processPayment = async (
  payerId: string,
  payerEmail: string,
  receiverId: string,
  receiverEmail: string,
  amount: number,
  type: 'invoice_payment' | 'product_payment',
  reference: string,
  description?: string
): Promise<void> => {
  try {
    await runTransaction(db, async (transaction) => {
      const payerRef = doc(db, 'users', payerId);

      const payerDoc = await transaction.get(payerRef);

      if (!payerDoc.exists()) {
        throw new Error('Payer not found');
      }

      const payerData = payerDoc.data();

      if (payerData.walletBalance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Update payer balance
      transaction.update(payerRef, {
        walletBalance: payerData.walletBalance - amount
      });

      // For demo purposes, we'll create a simple merchant record if it doesn't exist
      const receiverRef = doc(db, 'users', receiverId);
      const receiverDoc = await transaction.get(receiverRef);
      
      if (receiverDoc.exists()) {
        const receiverData = receiverDoc.data();
        transaction.update(receiverRef, {
          walletBalance: receiverData.walletBalance + amount
        });
      } else {
        // Create a basic merchant record for demo
        transaction.set(receiverRef, {
          id: receiverId,
          email: receiverEmail,
          role: 'merchant',
          walletBalance: amount,
          createdAt: new Date(),
          displayName: `Merchant (${receiverEmail})`
        });
      }

      // Record transaction
      const transactionData: Omit<Transaction, 'id'> = {
        payerId,
        payerEmail,
        receiverId,
        receiverEmail,
        amount,
        type,
        reference,
        status: 'completed',
        timestamp: new Date(),
        description
      };

      transaction.set(doc(collection(db, 'transactions')), transactionData);
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserTransactions = (userId: string, callback: (transactions: Transaction[]) => void) => {
  const q = query(
    collection(db, 'transactions'),
    where('payerId', '==', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore timestamp to Date
      if (data.timestamp && data.timestamp.toDate) {
        data.timestamp = data.timestamp.toDate();
      }
      transactions.push({ id: doc.id, ...data } as Transaction);
    });
    callback(transactions);
  });
};

export const getMerchantTransactions = (merchantId: string, callback: (transactions: Transaction[]) => void) => {
  const q = query(
    collection(db, 'transactions'),
    where('receiverId', '==', merchantId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Convert Firestore timestamp to Date
      if (data.timestamp && data.timestamp.toDate) {
        data.timestamp = data.timestamp.toDate();
      }
      transactions.push({ id: doc.id, ...data } as Transaction);
    });
    callback(transactions);
  });
};