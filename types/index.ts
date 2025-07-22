export interface User {
  id: string;
  email: string;
  role: 'client' | 'merchant';
  walletBalance: number;
  createdAt: Date;
  displayName?: string;
  phoneNumber?: string;
  nationalId?: string;
  businessName?: string;
  businessLicense?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
}

export interface Transaction {
  id: string;
  payerId: string;
  payerEmail: string;
  receiverId: string;
  receiverEmail: string;
  amount: number;
  type: 'top_up' | 'invoice_payment' | 'product_payment' | 'transfer' | 'withdrawal';
  reference: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  description?: string;
  paymentMethod?: 'mtn_momo' | 'unayo' | 'fnb' | 'swazibank' | 'standard_bank' | 'nedbank' | 'wallet';
  externalReference?: string;
  fees?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile_money' | 'bank' | 'card';
  icon: string;
  isActive: boolean;
  minAmount: number;
  maxAmount: number;
  fees: {
    fixed: number;
    percentage: number;
  };
  processingTime: string;
}

export interface TopUpRequest {
  userId: string;
  amount: number;
  paymentMethod: string;
  phoneNumber?: string;
  accountNumber?: string;
  reference: string;
}

export interface Invoice {
  id: string;
  merchantId: string;
  clientId?: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  createdAt: Date;
  dueDate: Date;
  paidAt?: Date;
  reference: string;
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  price: number;
  quantity: number;
  sku: string;
  description?: string;
  category?: string;
  isActive: boolean;
}

export interface KYCDocument {
  id: string;
  userId: string;
  type: 'national_id' | 'passport' | 'business_license' | 'proof_of_address';
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
}