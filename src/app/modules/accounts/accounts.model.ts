import { Schema, model } from 'mongoose';
import { IDebtors, ITransaction } from './accounts.interface';

const debtorSchema = new Schema<IDebtors>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
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

// Add compound unique index for user and name
debtorSchema.index({ user: 1, name: 1 }, { unique: true });

const transactionSchema = new Schema<ITransaction>(
  {
    debtorId: {
      type: Schema.Types.ObjectId,
      ref: 'Debtor',
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

export const Debtor = model<IDebtors>('Debtor', debtorSchema);
export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema
);
