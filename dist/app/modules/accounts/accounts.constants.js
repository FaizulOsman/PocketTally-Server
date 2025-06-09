"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountsSearchableFields = exports.accountsFilterableFields = exports.TRANSACTION_TYPES = void 0;
exports.TRANSACTION_TYPES = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
};
exports.accountsFilterableFields = [
    'searchTerm',
    'customerName',
    'type',
    'date',
    'amount',
];
exports.accountsSearchableFields = ['customerName', 'description'];
