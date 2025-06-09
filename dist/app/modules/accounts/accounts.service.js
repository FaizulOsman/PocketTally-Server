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
    static createCustomer(user, payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'User ID is required to create a customer');
            }
            if (!((_a = payload.customerName) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Customer name is required');
            }
            const findCustomer = yield accounts_model_1.CustomerAccount.findOne({
                customerName: payload.customerName,
                user: user === null || user === void 0 ? void 0 : user.id,
            });
            if (findCustomer) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Customer name already exist!');
            }
            const customer = new accounts_model_1.CustomerAccount({
                user: user.id,
                customerName: payload.customerName.trim(),
                phoneNumber: (_b = payload.phoneNumber) === null || _b === void 0 ? void 0 : _b.trim(),
                description: (_c = payload.description) === null || _c === void 0 ? void 0 : _c.trim(),
                totalDue: 0,
                recentTransactions: [],
            });
            const savedCustomer = yield customer.save();
            return savedCustomer;
        });
    }
    static getAllCustomers(filters, paginationOptions, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
            const andConditions = [];
            if (searchTerm) {
                andConditions.push({
                    $or: [
                        {
                            customerName: {
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
            const result = yield accounts_model_1.CustomerAccount.find((user === null || user === void 0 ? void 0 : user.role) === 'admin'
                ? whereConditions
                : {
                    $and: [whereConditions, { user: user === null || user === void 0 ? void 0 : user.id }],
                })
                .populate({ path: 'user', select: 'email' })
                .sort(sortConditions)
                .skip(skip)
                .limit(limit);
            const total = yield accounts_model_1.CustomerAccount.countDocuments((user === null || user === void 0 ? void 0 : user.role) === 'admin'
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
    static getSingleCustomer(verifiedUser, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findCustomer = yield accounts_model_1.CustomerAccount.findById(id);
            if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
                const userId = new mongodb_1.ObjectId(findCustomer === null || findCustomer === void 0 ? void 0 : findCustomer.user).toHexString();
                if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
                    throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to access the data!');
                }
            }
            return findCustomer;
        });
    }
    static updateCustomer(user, id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return accounts_model_1.CustomerAccount.findOneAndUpdate({ customerId: id }, { $set: payload }, { new: true });
        });
    }
    static deleteCustomer(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return accounts_model_1.CustomerAccount.findOneAndDelete({ customerId: id });
        });
    }
    static createTransaction(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = new accounts_model_1.Transaction(Object.assign(Object.assign({}, payload), { createdBy: user.id }));
            yield transaction.save();
            const customer = yield accounts_model_1.CustomerAccount.findById(payload === null || payload === void 0 ? void 0 : payload.customerId);
            if (!customer) {
                throw new Error('Customer not found');
            }
            // Update customer's total due
            const amountChange = payload.type === 'CREDIT' ? payload.amount : -payload.amount;
            customer.totalDue += amountChange;
            customer.lastTransactionDate = payload.date;
            // Add transaction to recent transactions
            const transactionObj = transaction.toObject();
            customer.recentTransactions = [
                ...customer.recentTransactions,
                transactionObj,
            ].slice(-10);
            yield customer.save();
            return transaction;
        });
    }
    static getCustomerTransactions(user, customerId, filters, paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
            const andConditions = [];
            // Base condition for customerId
            andConditions.push({
                customerId: new mongodb_1.ObjectId(customerId),
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
}
exports.AccountsService = AccountsService;
