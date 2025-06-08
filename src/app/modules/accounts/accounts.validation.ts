import { z } from 'zod';
import { TRANSACTION_TYPES } from './accounts.constants';

export const createCustomerSchema = z.object({
  body: z.object({
    customerName: z.string().min(1, 'Customer name is required'),
    phoneNumber: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const createTransactionSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    amount: z.number().positive('Amount must be positive'),
    type: z.enum([TRANSACTION_TYPES.CREDIT, TRANSACTION_TYPES.DEBIT]),
  }),
});
