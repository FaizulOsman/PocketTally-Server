import { z } from 'zod';
import { TRANSACTION_TYPES } from './transactors.constants';

export const createTransactorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    phoneNumber: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const createTransactionSchema = z.object({
  body: z.object({
    transactorId: z.string().min(1, 'Transactor ID is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum([TRANSACTION_TYPES.CREDIT, TRANSACTION_TYPES.DEBIT]),
  }),
});
