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
exports.VCardService = void 0;
const vCard_model_1 = require("./vCard.model");
const http_status_1 = __importDefault(require("http-status"));
const vCard_constants_1 = require("./vCard.constants");
// import { User } from '../user/user.model';
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const paginationHelper_1 = require("../../../helper/paginationHelper");
const vCardJS = require('vcards-js');
// Create VCard
const createVCard = (payload
// verifiedUser: any
) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield vCard_model_1.VCard.find({
        $and: [{ email: payload === null || payload === void 0 ? void 0 : payload.email }, { formName: payload === null || payload === void 0 ? void 0 : payload.phone }],
    });
    if (isExist.length > 0) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'You already have a from with this name.');
    }
    const result = yield vCard_model_1.VCard.create(payload);
    return result;
});
// Get All VCards (can also filter)
const getAllVCards = (filters, paginationOptions, verifiedUser) => __awaiter(void 0, void 0, void 0, function* () {
    // Try not to use any
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = []; // Try not to use any
    if (searchTerm) {
        andConditions === null || andConditions === void 0 ? void 0 : andConditions.push({
            $or: vCard_constants_1.vCardSearchableFields === null || vCard_constants_1.vCardSearchableFields === void 0 ? void 0 : vCard_constants_1.vCardSearchableFields.map(field => ({
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
    const result = yield vCard_model_1.VCard.find((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin'
        ? whereCondition
        : {
            $and: [whereCondition, { email: verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.email }],
        })
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const total = yield vCard_model_1.VCard.countDocuments((verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.role) === 'admin'
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
// Get Single VCard
const getSingleVCard = (verifiedUser, id) => __awaiter(void 0, void 0, void 0, function* () {
    const findId = yield vCard_model_1.VCard.findOne({ _id: id });
    const vCard = new vCardJS();
    vCard.firstName = findId === null || findId === void 0 ? void 0 : findId.name;
    vCard.email = findId === null || findId === void 0 ? void 0 : findId.email;
    vCard.cellPhone = findId === null || findId === void 0 ? void 0 : findId.phone;
    vCard.url = findId === null || findId === void 0 ? void 0 : findId.website;
    vCard.organization = findId === null || findId === void 0 ? void 0 : findId.company;
    vCard.title = findId === null || findId === void 0 ? void 0 : findId.designation;
    vCard.homeAddress = {
        label: 'Address',
        street: findId === null || findId === void 0 ? void 0 : findId.address,
    };
    vCard.photo.attachFromUrl(findId === null || findId === void 0 ? void 0 : findId.image.url, 'JPEG');
    // Add social media links using custom properties
    findId === null || findId === void 0 ? void 0 : findId.socialMedia.forEach(social => {
        vCard.socialUrls[social.type] = social.url;
    });
    // for (const [key, value] of Object.entries(findId?.socialMedia)) {
    //   vCard.socialUrls[key] = value;
    // }
    vCard.note = findId === null || findId === void 0 ? void 0 : findId.bio;
    return vCard.getFormattedString();
});
const updateVCard = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield vCard_model_1.VCard.findOne({ _id: id });
    if (!isExist) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'VCard not found');
    }
    const result = yield vCard_model_1.VCard.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
// Delete VCard
const deleteVCard = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vCard_model_1.VCard.findByIdAndDelete({ _id: id });
    if (!result) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'VCard Not Found');
    }
    return result;
});
const addReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield vCard_model_1.VCard.findOne({ _id: id });
    if (!isExist) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'VCard not found');
    }
    const result = yield vCard_model_1.VCard.findOneAndUpdate({ _id: id }, { $push: { reviews: payload } }, {
        new: true,
    }).populate('reviews');
    return result;
});
exports.VCardService = {
    createVCard,
    getAllVCards,
    getSingleVCard,
    updateVCard,
    deleteVCard,
    addReview,
};
