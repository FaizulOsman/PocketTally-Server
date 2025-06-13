import { Types } from 'mongoose';

export type ITransaction = {
  _id: Types.ObjectId;
  transactorId: Types.ObjectId;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type ITransactors = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  phoneNumber?: string;
  description?: string;
  totalDue: number;
  lastTransactionDate?: string;
  type: 'CREDITOR' | 'DEBTOR';
  createdAt: Date;
  updatedAt: Date;
};
