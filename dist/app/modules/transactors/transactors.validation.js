"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = exports.createTransactorSchema = void 0;
const zod_1 = require("zod");
const transactors_constants_1 = require("./transactors.constants");
exports.createTransactorSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required'),
        phoneNumber: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
    }),
});
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        transactorId: zod_1.z.string().min(1, 'Transactor ID is required'),
        amount: zod_1.z.number().positive('Amount must be positive'),
        type: zod_1.z.enum([transactors_constants_1.TRANSACTION_TYPES.CREDIT, transactors_constants_1.TRANSACTION_TYPES.DEBIT]),
    }),
});
