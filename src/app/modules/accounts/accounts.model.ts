import { Schema, model } from 'mongoose';
import { ICustomerAccount, ITransaction } from './accounts.interface';

const customerAccountSchema = new Schema<ICustomerAccount>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    totalDue: {
      type: Number,
      default: 0,
    },
    lastTransactionDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add compound unique index for user and customerName
customerAccountSchema.index({ user: 1, customerName: 1 }, { unique: true });

const transactionSchema = new Schema<ITransaction>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'CustomerAccount',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CustomerAccount = model<ICustomerAccount>(
  'CustomerAccount',
  customerAccountSchema
);
export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema
);
