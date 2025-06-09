"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const accounts_constants_1 = require("./accounts.constants");
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerName: zod_1.z.string().min(1, 'Customer name is required'),
        phoneNumber: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().min(1, 'Customer ID is required'),
        amount: zod_1.z.number().positive('Amount must be positive'),
        type: zod_1.z.enum([accounts_constants_1.TRANSACTION_TYPES.CREDIT, accounts_constants_1.TRANSACTION_TYPES.DEBIT]),
    }),
});
