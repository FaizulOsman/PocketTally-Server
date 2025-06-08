import mongoose, { Schema, model } from 'mongoose';
import { ITransaction, ICustomerAccount } from './accounts.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    description: { type: String },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const customerAccountSchema = new Schema<ICustomerAccount>(
  {
    customerName: { type: String, required: true },
    totalDue: { type: Number, default: 0 },
    lastTransactionDate: { type: String },
    recentTransactions: [transactionSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema
);

export const CustomerAccount = model<ICustomerAccount>(
  'CustomerAccount',
  customerAccountSchema
);
