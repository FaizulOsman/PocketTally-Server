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
exports.TransactorsService = void 0;
const transactors_model_1 = require("./transactors.model");
const paginationHelper_1 = require("../../../helper/paginationHelper");
const mongodb_1 = require("mongodb");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const http_status_1 = __importDefault(require("http-status"));
class TransactorsService {
    static createTransactor(user, payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'User ID is required to create a transactor');
            }
            if (!((_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Name is required');
            }
            const findTransactor = yield transactors_model_1.Transactor.findOne({
                name: payload === null || payload === void 0 ? void 0 : payload.name,
                user: user === null || user === void 0 ? void 0 : user.id,
            });
            if (findTransactor) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Transactor name already exist!');
            }
            const transactor = new transactors_model_1.Transactor({
                user: user.id,
                name: payload === null || payload === void 0 ? void 0 : payload.name.trim(),
                phoneNumber: (_b = payload === null || payload === void 0 ? void 0 : payload.phoneNumber) === null || _b === void 0 ? void 0 : _b.trim(),
                description: (_c = payload === null || payload === void 0 ? void 0 : payload.description) === null || _c === void 0 ? void 0 : _c.trim(),
                type: payload === null || payload === void 0 ? void 0 : payload.type.trim(),
                totalDue: 0,
            });
            const savedTransactor = yield transactor.save();
            return savedTransactor;
        });
    }
    static getAllTransactors(filters, paginationOptions, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchTerm, type, showAllUsersData } = filters, filtersData = __rest(filters, ["searchTerm", "type", "showAllUsersData"]);
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
            if (type) {
                andConditions.push({
                    type: {
                        $in: type || 'debtor',
                    },
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
            const result = yield transactors_model_1.Transactor.find((user === null || user === void 0 ? void 0 : user.role) === 'admin' && showAllUsersData === 'true'
                ? whereConditions
                : {
                    $and: [whereConditions, { user: user === null || user === void 0 ? void 0 : user.id }],
                })
                .populate({ path: 'user', select: 'email' })
                .sort(sortConditions)
                .skip(skip)
                .limit(limit);
            const total = yield transactors_model_1.Transactor.countDocuments((user === null || user === void 0 ? void 0 : user.role) === 'admin' && showAllUsersData === 'true'
                ? whereConditions
                : {
                    $and: [whereConditions, { user: user === null || user === void 0 ? void 0 : user.id }],
                });
            // --- Calculate calculatedAmount for each transactor ---
            const transactorIds = result.map(t => t._id);
            const transactionSums = yield transactors_model_1.Transaction.aggregate([
                { $match: { transactorId: { $in: transactorIds } } },
                {
                    $group: {
                        _id: '$transactorId',
                        credit: {
                            $sum: {
                                $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0],
                            },
                        },
                        debit: {
                            $sum: {
                                $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0],
                            },
                        },
                    },
                },
            ]);
            const sumMap = {};
            transactionSums.forEach(item => {
                sumMap[item._id.toString()] = {
                    credit: item.credit || 0,
                    debit: item.debit || 0,
                };
            });
            const resultWithCalculatedAmount = result.map(transactor => {
                const sums = sumMap[transactor._id.toString()] || { credit: 0, debit: 0 };
                return Object.assign(Object.assign({}, transactor.toObject()), { calculatedAmount: sums.credit - sums.debit });
            });
            // --- End calculatedAmount logic ---
            return {
                meta: {
                    page,
                    limit,
                    total,
                },
                data: resultWithCalculatedAmount,
            };
        });
    }
    static getSingleTransactor(verifiedUser, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findTransactor = yield transactors_model_1.Transactor.findById(id);
            if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
                const userId = new mongodb_1.ObjectId(findTransactor === null || findTransactor === void 0 ? void 0 : findTransactor.user).toHexString();
                if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
                    throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to access the data!');
                }
            }
            return findTransactor;
        });
    }
    static updateTransactor(user, id, payload) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const findTransactor = yield transactors_model_1.Transactor.findById(id);
            if (!findTransactor) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transactor not found');
            }
            if ((user === null || user === void 0 ? void 0 : user.role) !== 'admin') {
                const userId = new mongodb_1.ObjectId(findTransactor === null || findTransactor === void 0 ? void 0 : findTransactor.user).toHexString();
                if (userId !== (user === null || user === void 0 ? void 0 : user.id)) {
                    throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You are not authorized to update this transactor!');
                }
            }
            // If transactor name is being updated, check for duplicates
            if (payload.name) {
                const existingTransactor = yield transactors_model_1.Transactor.findOne({
                    name: payload.name,
                    user: user.id,
                    _id: { $ne: id },
                });
                if (existingTransactor) {
                    throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Transactor name already exists!');
                }
            }
            const result = yield transactors_model_1.Transactor.findByIdAndUpdate(id, {
                $set: Object.assign(Object.assign({}, payload), { name: ((_a = payload.name) === null || _a === void 0 ? void 0 : _a.trim()) || findTransactor.name, phoneNumber: ((_b = payload.phoneNumber) === null || _b === void 0 ? void 0 : _b.trim()) || findTransactor.phoneNumber, description: ((_c = payload.description) === null || _c === void 0 ? void 0 : _c.trim()) || findTransactor.description, type: ((_d = payload.type) === null || _d === void 0 ? void 0 : _d.trim()) || findTransactor.type }),
            }, { new: true }).populate({ path: 'user', select: 'email' });
            return result;
        });
    }
    static deleteTransactor(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return transactors_model_1.Transactor.findOneAndDelete({ transactorId: id });
        });
    }
    static createTransaction(user, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = new transactors_model_1.Transaction(Object.assign(Object.assign({}, payload), { createdBy: user.id }));
            yield transaction.save();
            const transactor = yield transactors_model_1.Transactor.findById(payload === null || payload === void 0 ? void 0 : payload.transactorId);
            if (!transactor) {
                throw new Error('Transactor not found');
            }
            // Update Transactors total due
            const amountChange = payload.type === 'CREDIT' ? payload.amount : -payload.amount;
            transactor.totalDue += amountChange;
            transactor.lastTransactionDate = payload.date;
            yield transactor.save();
            return transaction;
        });
    }
    static getTransactorTransactions(user, transactorId, filters, paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
            const andConditions = [];
            // Base condition for transactorId
            andConditions.push({
                transactorId: new mongodb_1.ObjectId(transactorId),
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
            const result = yield transactors_model_1.Transaction.find(whereConditions)
                .sort(sortConditions)
                .skip(skip)
                .limit(limit);
            const total = yield transactors_model_1.Transaction.countDocuments(whereConditions);
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
            const transaction = yield transactors_model_1.Transaction.findById(id);
            if (!transaction) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
            }
            const transactor = yield transactors_model_1.Transactor.findById(transaction.transactorId);
            if (!transactor) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transactor not found');
            }
            // Calculate the difference in amount
            const oldAmount = transaction.amount;
            const newAmount = payload.amount || oldAmount;
            const amountDifference = newAmount - oldAmount;
            // Update transaction
            const updatedTransaction = yield transactors_model_1.Transaction.findByIdAndUpdate(id, Object.assign({}, payload), { new: true });
            // Update transactors total due
            if (transaction.type === 'CREDIT') {
                transactor.totalDue += amountDifference;
            }
            else {
                transactor.totalDue -= amountDifference;
            }
            yield transactor.save();
            return updatedTransaction;
        });
    }
    static deleteTransaction(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transactors_model_1.Transaction.findById(id);
            if (!transaction) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
            }
            const transactor = yield transactors_model_1.Transactor.findById(transaction.transactorId);
            if (!transactor) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transactor not found');
            }
            // Update transactors total due
            if (transaction.type === 'CREDIT') {
                transactor.totalDue -= transaction.amount;
            }
            else {
                transactor.totalDue += transaction.amount;
            }
            yield transactor.save();
            return transactors_model_1.Transaction.findByIdAndDelete(id);
        });
    }
}
exports.TransactorsService = TransactorsService;
