import { Types } from 'mongoose';

export type ITransaction = {
  _id: Types.ObjectId;
  debtorId: Types.ObjectId;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type IDebtors = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  phoneNumber?: string;
  description?: string;
  totalDue: number;
  lastTransactionDate?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ICreateDebtorDto = {
  name: string;
  phoneNumber?: string;
  description?: string;
};

export type ICreateTransactionDto = {
  debtorId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description?: string;
};
