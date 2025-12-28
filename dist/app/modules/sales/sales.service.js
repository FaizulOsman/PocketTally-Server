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
exports.SalesService = void 0;
const sales_model_1 = require("./sales.model");
const http_status_1 = __importDefault(require("http-status"));
const sales_constants_1 = require("./sales.constants");
const user_model_1 = require("../user/user.model");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const mongodb_1 = require("mongodb");
// =========================================================
// Monthly Sales Services
// =========================================================
const createSalesMonthly = (verifiedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { monthId } = payload;
    const findUser = yield user_model_1.User.findById(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id);
    if (!findUser) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isExist = yield sales_model_1.SalesMonthly.findOne({
        user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id,
        monthId,
    });
    if (isExist) {
        throw new apiError_1.default(http_status_1.default.CONFLICT, 'Sales record for this month already exists!');
    }
    const result = yield sales_model_1.SalesMonthly.create(Object.assign(Object.assign({}, payload), { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }));
    return result;
});
const getAllSalesMonthly = (filters, paginationOptions, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, showAllUsersData } = filters, filtersData = __rest(filters, ["searchTerm", "showAllUsersData"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: sales_constants_1.salesSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = sortBy && sortOrder ? { [sortBy]: sortOrder } : '';
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const query = sales_model_1.SalesMonthly.find((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin' && showAllUsersData === 'true'
        ? whereCondition
        : {
            $and: [whereCondition, { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }],
        })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin') {
        query.populate({ path: 'user', select: 'email' });
    }
    const result = yield query;
    const total = yield sales_model_1.SalesMonthly.countDocuments((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin' && showAllUsersData === 'true'
        ? whereCondition
        : {
            $and: [whereCondition, { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }],
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
const getSingleSalesMonthly = (verifiedUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    const findData = yield sales_model_1.SalesMonthly.findById(id);
    if (!findData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Data not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findData === null || findData === void 0 ? void 0 : findData.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to access this data!');
        }
    }
    return findData;
});
const updateSalesMonthly = (verifiedUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findData = yield sales_model_1.SalesMonthly.findById(id);
    if (!findData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Data not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findData === null || findData === void 0 ? void 0 : findData.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this data!');
        }
    }
    const result = yield sales_model_1.SalesMonthly.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteSalesMonthly = (id, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const findData = yield sales_model_1.SalesMonthly.findById(id);
    if (!findData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Data not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findData === null || findData === void 0 ? void 0 : findData.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this data!');
        }
    }
    // Delete all daily transactions for this month
    yield sales_model_1.SalesDaily.deleteMany({
        user: findData.user,
        monthId: findData.monthId,
    });
    const result = yield sales_model_1.SalesMonthly.findByIdAndDelete(id);
    return result;
});
// =========================================================
// Daily Sales Services
// =========================================================
const createSalesDaily = (verifiedUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { monthId, value } = payload;
    const findUser = yield user_model_1.User.findById(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id);
    if (!findUser) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Ensure monthly record exists or create/update it
    // Using findOneAndUpdate with upsert to handle race conditions or missing months
    yield sales_model_1.SalesMonthly.findOneAndUpdate({ user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id, monthId }, {
        $inc: { totalAmount: value },
        $setOnInsert: {
            user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id,
            monthId,
            monthLabel: payload.monthLabel || monthId, // Basic fallback
        },
    }, { upsert: true, new: true });
    const result = yield sales_model_1.SalesDaily.create(Object.assign(Object.assign({}, payload), { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }));
    return result;
});
const getAllSalesDaily = (filters, paginationOptions, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, showAllUsersData } = filters, filtersData = __rest(filters, ["searchTerm", "showAllUsersData"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: ['title'].map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = sortBy && sortOrder ? { [sortBy]: sortOrder } : '';
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const query = sales_model_1.SalesDaily.find((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin' && showAllUsersData === 'true'
        ? whereCondition
        : {
            $and: [whereCondition, { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }],
        })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin') {
        query.populate({ path: 'user', select: 'email' });
    }
    const result = yield query;
    const total = yield sales_model_1.SalesDaily.countDocuments((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin' && showAllUsersData === 'true'
        ? whereCondition
        : {
            $and: [whereCondition, { user: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id }],
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
const getSingleSalesDaily = (verifiedUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    const findData = yield sales_model_1.SalesDaily.findById(id);
    if (!findData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findData === null || findData === void 0 ? void 0 : findData.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to access this data!');
        }
    }
    return findData;
});
const updateSalesDaily = (verifiedUser, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findData = yield sales_model_1.SalesDaily.findById(id);
    if (!findData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findData === null || findData === void 0 ? void 0 : findData.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to update this data!');
        }
    }
    // Calculate difference if value is changing
    if (payload.value !== undefined && payload.value !== findData.value) {
        const diff = payload.value - findData.value;
        yield sales_model_1.SalesMonthly.findOneAndUpdate({ user: findData.user, monthId: findData.monthId }, { $inc: { totalAmount: diff } });
    }
    // Handle monthId change (move transaction to another month)
    if (payload.monthId && payload.monthId !== findData.monthId) {
        // Remove value from old month
        yield sales_model_1.SalesMonthly.findOneAndUpdate({ user: findData.user, monthId: findData.monthId }, { $inc: { totalAmount: -findData.value } });
        // Add value to new month (new value or old value)
        const newValue = payload.value !== undefined ? payload.value : findData.value;
        yield sales_model_1.SalesMonthly.findOneAndUpdate({ user: findData.user, monthId: payload.monthId }, { $inc: { totalAmount: newValue } }, { upsert: true });
    }
    const result = yield sales_model_1.SalesDaily.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteSalesDaily = (id, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const findData = yield sales_model_1.SalesDaily.findById(id);
    if (!findData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Transaction not found');
    }
    if ((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) !== 'admin') {
        const userId = new mongodb_1.ObjectId(findData === null || findData === void 0 ? void 0 : findData.user).toHexString();
        if (userId !== (verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.id)) {
            throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'You are not authorized to delete this data!');
        }
    }
    // Decrease monthly total
    yield sales_model_1.SalesMonthly.findOneAndUpdate({ user: findData.user, monthId: findData.monthId }, { $inc: { totalAmount: -findData.value } });
    const result = yield sales_model_1.SalesDaily.findByIdAndDelete(id);
    return result;
});
exports.SalesService = {
    createSalesMonthly,
    getAllSalesMonthly,
    getSingleSalesMonthly,
    updateSalesMonthly,
    deleteSalesMonthly,
    createSalesDaily,
    getAllSalesDaily,
    getSingleSalesDaily,
    updateSalesDaily,
    deleteSalesDaily,
};
