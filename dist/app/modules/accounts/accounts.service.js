"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsService = void 0;
const accounts_model_1 = require("./accounts.model");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const mongodb_1 = require("mongodb");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
class AccountsService {
    static createDebtor(user, payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'User ID is required to create a debtor');
            }
            if (!((_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Name is required');
            }
            const findDebtor = yield accounts_model_1.Debtor.findOne({
                name: payload === null || payload === void 0 ? void 0 : payload.name,
                user: user === null || user === void 0 ? void 0 : user.id,
            });
            if (findDebtor) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Debtor name already exist!');
            }
            const debtor = new accounts_model_1.Debtor({
                user: user.id,
                name: payload === null || payload === void 0 ? void 0 : payload.name.trim(),
                phoneNumber: (_b = payload === null || payload === void 0 ? void 0 : payload.phoneNumber) === null || _b === void 0 ? void 0 : _b.trim(),
                description: (_c = payload === null || payload === void 0 ? void 0 : payload.description) === null || _c === void 0 ? void 0 : _c.trim(),
                totalDue: 0,
            });
            const savedDebtor = yield debtor.save();
            return savedDebtor;
        });
    }
    static getAllDebtors(filters, paginationOptions, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
            const andConditions = [];
            if (searchTerm) {
                andConditions.push({
                    $or: [
                        {
                            name: {
                                $regex: searchTerm,
                                $options: 'i',
                            },
                        },
                    ],
                });
            }
            if (Object.keys(filtersData).length) {
                andConditions.push({
                    $and: Object.entries(filtersData).map(([field, value]) => ({
                        [field]: value,
                    })),
                });
            }
            const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
            const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
            const sortConditions = {};
            if (sortBy && sortOrder) {
                sortConditions[sortBy] = sortOrder;
            }
            const result = yield accounts_model_1.Debtor.find((user === null || user === void 0 ? void 0 : user.role) === 'admin'
                ? whereConditions
                : {
                    $and: [whereConditions, { user: user === null || user === void 0 ? void 0 : user.id }],
                })
                .populate({ path: 'user', select: 'email' })
                .sort(sortConditions)
                .skip(skip)
                .limit(limit);
            const total = yield accounts_model_1.Debtor.countDocuments((user === null || user === void 0 ? void 0 : user.role) === 'admin'
                ? whereConditions
                : {
                    $and: [whereConditions, { user: user === null || user === void 0 ? void 0 : user.id }],
                });
            return {
                meta: {
                    page,
                    limit,
                    total,
                },
                data: result,
            };
        });
    }
    static getSingleDebtor(verifiedUser, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findDebtor = yield accounts_model_1.Debtor.findById(id);
            if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
                const userId = new mongodb_1.ObjectId(findDebtor === null || findDebtor === void 0 ? void 0 : findDebtor.user).toHexString();
                if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
                    throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to access the data!');
                }
            }
            return findDebtor;
        });
    }
    static updateDebtor(user, id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const findDebtor = yield accounts_model_1.Debtor.findById(id);
            if (!findDebtor) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Debtor not found');
            }
            if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
                const userId = new mongodb_1.ObjectId(findDebtor === null || findDebtor === void 0 ? void 0 : findDebtor.user).toHexString();
                if (userId !== (user === null || user === void 0 ? void 0 : user.id)) {
                    throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to update this debtor!');
                }
            }
            // If debtor name is being updated, check for duplicates
            if (payload.name) {
                const existingDebtor = yield accounts_model_1.Debtor.findOne({
                    name: payload.name,
                    user: user.id,
                    _id: { $ne: id },
                });
                if (existingDebtor) {
                    throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Debtor name already exists!');
                }
            }
            const result = yield accounts_model_1.Debtor.findByIdAndUpdate(id, { $set: payload }, { new: true }).populate({ path: 'user', select: 'email' });
            return result;
        });
    }
    static deleteDebtor(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return accounts_model_1.Debtor.findOneAndDelete({ debtorId: id });
        });
    }
    static createTransaction(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = new accounts_model_1.Transaction(Object.assign(Object.assign({}, payload), { createdBy: user.id }));
            yield transaction.save();
            const debtor = yield accounts_model_1.Debtor.findById(payload === null || payload === void 0 ? void 0 : payload.debtorId);
            if (!debtor) {
                throw new Error('Debtor not found');
            }
            // Update debtors total due
            const amountChange = payload.type === 'CREDIT' ? payload.amount : -payload.amount;
            debtor.totalDue += amountChange;
            debtor.lastTransactionDate = payload.date;
            yield debtor.save();
            return transaction;
        });
    }
    static getDebtorTransactions(user, debtorId, filters, paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
            const andConditions = [];
            // Base condition for debtorId
            andConditions.push({
                debtorId: new mongodb_1.ObjectId(debtorId),
            });
            if (searchTerm) {
                andConditions.push({
                    $or: [
                        {
                            description: {
                                $regex: searchTerm,
                                $options: 'i',
                            },
                        },
                    ],
                });
            }
            if (Object.keys(filtersData).length) {
                andConditions.push({
                    $and: Object.entries(filtersData).map(([field, value]) => ({
                        [field]: value,
                    })),
                });
            }
            const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
            const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
            const sortConditions = {};
            if (sortBy && sortOrder) {
                sortConditions[sortBy] = sortOrder;
            }
            else {
                // Default sort by date in descending order
                sortConditions['date'] = -1;
            }
            const result = yield accounts_model_1.Transaction.find(whereConditions)
                .sort(sortConditions)
                .skip(skip)
                .limit(limit);
            const total = yield accounts_model_1.Transaction.countDocuments(whereConditions);
            return {
                meta: {
                    page,
                    limit,
                    total,
                },
                data: result,
            };
        });
    }
    static updateTransaction(user, id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield accounts_model_1.Transaction.findById(id);
            if (!transaction) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
            }
            const debtor = yield accounts_model_1.Debtor.findById(transaction.debtorId);
            if (!debtor) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Debtor not found');
            }
            // Calculate the difference in amount
            const oldAmount = transaction.amount;
            const newAmount = payload.amount || oldAmount;
            const amountDifference = newAmount - oldAmount;
            // Update transaction
            const updatedTransaction = yield accounts_model_1.Transaction.findByIdAndUpdate(id, Object.assign({}, payload), { new: true });
            // Update debtors total due
            if (transaction.type === 'CREDIT') {
                debtor.totalDue += amountDifference;
            }
            else {
                debtor.totalDue -= amountDifference;
            }
            yield debtor.save();
            return updatedTransaction;
        });
    }
    static deleteTransaction(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield accounts_model_1.Transaction.findById(id);
            if (!transaction) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
            }
            const debtor = yield accounts_model_1.Debtor.findById(transaction.debtorId);
            if (!debtor) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Debtor not found');
            }
            // Update debtors total due
            if (transaction.type === 'CREDIT') {
                debtor.totalDue -= transaction.amount;
            }
            else {
                debtor.totalDue += transaction.amount;
            }
            yield debtor.save();
            return accounts_model_1.Transaction.findByIdAndDelete(id);
        });
    }
}
exports.AccountsService = AccountsService;
