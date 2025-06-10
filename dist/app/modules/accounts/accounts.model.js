"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Debtor = void 0;
const mongoose_1 = require("mongoose");
const debtorSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Add compound unique index for user and name
debtorSchema.index({ user: 1, name: 1 }, { unique: true });
const transactionSchema = new mongoose_1.Schema({
    debtorId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Debtor = (0, mongoose_1.model)('Debtor', debtorSchema);
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
