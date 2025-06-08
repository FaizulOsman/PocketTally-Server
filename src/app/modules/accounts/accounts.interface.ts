import { Types } from 'mongoose';

export type ITransaction = {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type ICustomerAccount = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  customerName: string;
  phoneNumber?: string;
  description?: string;
  totalDue: number;
  lastTransactionDate?: string;
  recentTransactions: any[];
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateCustomerDto = {
  customerName: string;
  phoneNumber?: string;
  description?: string;
};

export type ICreateTransactionDto = {
  customerId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description?: string;
};
