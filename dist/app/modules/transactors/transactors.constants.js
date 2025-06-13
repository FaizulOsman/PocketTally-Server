"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactorsSearchableFields = exports.transactorsFilterableFields = exports.TRANSACTION_TYPES = void 0;
exports.TRANSACTION_TYPES = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
};
exports.transactorsFilterableFields = [
    'searchTerm',
    'name',
    'type',
    'date',
    'amount',
    'showAllUsersData',
];
exports.transactorsSearchableFields = ['name', 'description'];
