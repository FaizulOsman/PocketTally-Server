"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.CustomerAccount = void 0;
const mongoose_1 = require("mongoose");
const customerAccountSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    recentTransactions: {
        type: mongoose_1.Schema.Types.Mixed,
        default: [],
    },
}, {
    timestamps: true,
});
// Add compound unique index for user and customerName
customerAccountSchema.index({ user: 1, customerName: 1 }, { unique: true });
const transactionSchema = new mongoose_1.Schema({
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.CustomerAccount = (0, mongoose_1.model)('CustomerAccount', customerAccountSchema);
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
