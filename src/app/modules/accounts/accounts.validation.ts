import { z } from 'zod';
import { TRANSACTION_TYPES } from './accounts.constants';

export const createDebtorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    phoneNumber: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const createTransactionSchema = z.object({
  body: z.object({
    debtorId: z.string().min(1, 'Debtor ID is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum([TRANSACTION_TYPES.CREDIT, TRANSACTION_TYPES.DEBIT]),
  }),
});
