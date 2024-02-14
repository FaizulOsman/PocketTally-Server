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
exports.FormService = void 0;
const form_model_1 = require("./form.model");
const http_status_1 = __importDefault(require("http-status"));
const form_constants_1 = require("./form.constants");
const user_model_1 = require("../user/user.model");
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
// Create Form
const createForm = (payload, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.find({ _id: verifiedUser.id });
    if (user.length === 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isExist = yield form_model_1.Form.find({
        $and: [{ email: payload === null || payload === void 0 ? void 0 : payload.email }, { formName: payload === null || payload === void 0 ? void 0 : payload.formName }],
    });
    console.log('Already Exist: ', isExist);
    if (isExist.length > 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You already have a from with this name.');
    }
    const result = yield form_model_1.Form.create(payload);
    return result;
});
// Get All Forms (can also filter)
const getAllForms = (filters, paginationOptions, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // Try not to use any
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = []; // Try not to use any
    if (searchTerm) {
        andConditions === null || andConditions === void 0 ? void 0 : andConditions.push({
            $or: form_constants_1.formSearchableFields === null || form_constants_1.formSearchableFields === void 0 ? void 0 : form_constants_1.formSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => {
                return { [field]: value };
            }),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortCondition = sortBy &&
        sortOrder && { [sortBy]: sortOrder };
    const whereCondition = (andConditions === null || andConditions === void 0 ? void 0 : andConditions.length) > 0 ? { $and: andConditions } : {};
    const result = yield form_model_1.Form.find((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin'
        ? whereCondition
        : {
            $and: [whereCondition, { email: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.email }],
        })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield form_model_1.Form.countDocuments((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin'
        ? whereCondition
        : {
            $and: [whereCondition, { email: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.email }],
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
// Get Single Form
const getSingleForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield form_model_1.Form.findById(id);
    return result;
});
const updateForm = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield form_model_1.Form.findOne({ _id: id });
    if (!isExist) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Form not found');
    }
    const result = yield form_model_1.Form.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// Delete Form
const deleteForm = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield form_model_1.Form.findByIdAndDelete(id);
    if (!result) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Form Not Found');
    }
    return result;
});
const addReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield form_model_1.Form.findOne({ _id: id });
    if (!isExist) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Form not found');
    }
    const result = yield form_model_1.Form.findOneAndUpdate({ _id: id }, { $push: { reviews: payload } }, {
        new: true,
    }).populate('reviews');
    return result;
});
exports.FormService = {
    createForm,
    getAllForms,
    getSingleForm,
    updateForm,
    deleteForm,
    addReview,
};
