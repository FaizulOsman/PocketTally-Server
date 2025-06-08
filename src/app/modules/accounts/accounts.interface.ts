import mongoose from 'mongoose';

export type ITransaction = {
  customerId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description?: string;
  date: string;
};

export type ICustomerAccount = {
  customerName: string;
  totalDue: number;
  lastTransactionDate: string;
  recentTransactions: ITransaction[];
  user: mongoose.Types.ObjectId;
};

export type ICreateCustomerDto = {
  customerName: string;
};

export type ICreateTransactionDto = {
  customerId: mongoose.Types.ObjectId;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description?: string;
  date: string;
};
