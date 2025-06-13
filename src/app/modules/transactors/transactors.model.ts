import { Schema, model } from 'mongoose';
import { ITransactors, ITransaction } from './transactors.interface';

const transactorSchema = new Schema<ITransactors>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String },
    description: { type: String },
    totalDue: { type: Number, default: 0 },
    lastTransactionDate: { type: String },
    type: { type: String, enum: ['CREDITOR', 'DEBTOR'] },
  },
  { timestamps: true }
);

// Add compound unique index for user and name
transactorSchema.index({ user: 1, name: 1 }, { unique: true });

const transactionSchema = new Schema<ITransaction>(
  {
    transactorId: {
      type: Schema.Types.ObjectId,
      ref: 'Transactor',
      required: true,
    },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    date: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Transactor = model<ITransactors>('Transactor', transactorSchema);
export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema
);
