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
exports.FormDataService = void 0;
const formData_model_1 = require("./formData.model");
const http_status_1 = __importDefault(require("http-status"));
const formData_constants_1 = require("./formData.constants");
const user_model_1 = require("../user/user.model");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const form_model_1 = require("../form/form.model");
// Create
const createData = (payload, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield user_model_1.User.find({ _id: verifiedUser.id });
    if (user.length === 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const form = yield form_model_1.Form.findOne({ _id: payload === null || payload === void 0 ? void 0 : payload.formId });
    if (!form || !(form === null || form === void 0 ? void 0 : form.formData)) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Form not found');
    }
    const parsedData = JSON.parse(payload === null || payload === void 0 ? void 0 : payload.data);
    const relationFields = (_a = form === null || form === void 0 ? void 0 : form.formData) === null || _a === void 0 ? void 0 : _a.filter(f => f === null || f === void 0 ? void 0 : f.relation);
    // Validate required fields
    form.formData.forEach((field) => {
        if (field.required && !(field.name in parsedData)) {
            throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Missing required field: ${field.name}`);
        }
    });
    // Process relations
    relationFields === null || relationFields === void 0 ? void 0 : relationFields.forEach(field => {
        const [field1, operator, field2] = field.relation.split(/([-+*/])/); // Split "Sales-Cost" into ["Sales", "-", "Cost"]
        const value1 = parsedData[field1.trim()];
        const value2 = parsedData[field2.trim()];
        // Perform the operation
        if (value1 !== undefined && value2 !== undefined) {
            switch (operator) {
                case '+':
                    parsedData[field.name] = value1 + value2;
                    break;
                case '-':
                    parsedData[field.name] = value1 - value2;
                    break;
                case '*':
                    parsedData[field.name] = value1 * value2;
                    break;
                case '/':
                    parsedData[field.name] = value2 !== 0 ? value1 / value2 : null; // Prevent division by zero
                    break;
                default:
                    throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid relation operator: ${operator}`);
            }
        }
    });
    // Update payload data
    payload.data = JSON.stringify(parsedData);
    // Create new data entry
    const result = yield formData_model_1.FormData.create(payload);
    return result;
});
// Get All
const getAllData = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Try not to use any
    const { searchTerm, dateRange } = filters, filtersData = __rest(filters, ["searchTerm", "dateRange"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions === null || andConditions === void 0 ? void 0 : andConditions.push({
            $or: formData_constants_1.formDataSearchableFields === null || formData_constants_1.formDataSearchableFields === void 0 ? void 0 : formData_constants_1.formDataSearchableFields.map(field => ({
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
    // Add date range filter if available and valid
    if (dateRange) {
        const [startDate, endDate] = dateRange
            .split('-')
            .map(date => new Date(date.trim()));
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
            andConditions.push({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            });
        }
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = sortBy && sortOrder ? { [sortBy]: sortOrder } : '';
    const whereCondition = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield formData_model_1.FormData.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield formData_model_1.FormData.countDocuments(whereCondition);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
// Get Single
const getSingleData = (verifiedUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    // const formData = await FormData.findById({ _id: id });
    // console.log(formData);
    // if (formData?.userEmail !== verifiedUser?.email) {
    //   throw new ApiError(
    //     httpStatus.NOT_FOUND,
    //     'You are not authorized to access this!'
    //   );
    // }
    const result = yield formData_model_1.FormData.findById({ _id: id });
    return result;
});
const updateData = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingData = yield formData_model_1.FormData.findOne({ _id: id });
    if (!existingData) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Form not found');
    }
    const form = yield form_model_1.Form.findOne({ _id: existingData.formId });
    if (!form || !form.formData) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Form not found');
    }
    const existingParsedData = JSON.parse(existingData.data);
    const updatedParsedData = JSON.parse(payload.data || '{}');
    const fullData = Object.assign(Object.assign({}, existingParsedData), updatedParsedData);
    const relationFields = form.formData.filter(f => f.relation);
    relationFields.forEach(field => {
        const [field1, operator, field2] = field.relation.split(/([-+*/])/);
        const value1 = fullData[field1.trim()];
        const value2 = fullData[field2.trim()];
        if (value1 !== undefined && value2 !== undefined) {
            switch (operator) {
                case '+':
                    fullData[field.name] = value1 + value2;
                    break;
                case '-':
                    fullData[field.name] = value1 - value2;
                    break;
                case '*':
                    fullData[field.name] = value1 * value2;
                    break;
                case '/':
                    fullData[field.name] = value2 !== 0 ? value1 / value2 : null;
                    break;
                default:
                    throw new apiError_1.default(http_status_1.default.BAD_REQUEST, `Invalid relation operator: ${operator}`);
            }
        }
    });
    payload.data = JSON.stringify(fullData);
    const result = yield formData_model_1.FormData.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// Delete Single
const deleteData = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield formData_model_1.FormData.findByIdAndDelete({ _id: id });
    if (!result) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Data Not Found');
    }
    return result;
});
// Delete Many
const deleteMany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield formData_model_1.FormData.deleteMany({ formId: id });
    if (!result) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Data Not Found');
    }
    return result;
});
exports.FormDataService = {
    createData,
    getAllData,
    getSingleData,
    updateData,
    deleteData,
    deleteMany,
};
