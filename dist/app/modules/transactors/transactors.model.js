"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Transactor = void 0;
const mongoose_1 = require("mongoose");
const transactorSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String },
    description: { type: String },
    totalDue: { type: Number, default: 0 },
    lastTransactionDate: { type: String },
    type: { type: String, enum: ['CREDITOR', 'DEBTOR'] },
}, { timestamps: true });
// Add compound unique index for user and name
transactorSchema.index({ user: 1, name: 1 }, { unique: true });
const transactionSchema = new mongoose_1.Schema({
    transactorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Transactor',
        required: true,
    },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    date: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.Transactor = (0, mongoose_1.model)('Transactor', transactorSchema);
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
