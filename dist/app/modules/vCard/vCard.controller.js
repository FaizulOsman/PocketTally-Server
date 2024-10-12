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
exports.VCardController = void 0;
const vCard_service_1 = require("./vCard.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const vCard_constants_1 = require("./vCard.constants");
const pagination_1 = require("../../../constants/pagination");
const config_1 = __importDefault(require("../../../config"));
const pick_1 = require("../../../shared/pick");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
// Create VCard
const createVCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const token: any = req.headers.authorization;
    // const verifiedUser = jwtHelpers.verifyToken(
    //   token,
    //   config.jwt.secret as Secret
    // );
    const vCardData = __rest(req.body, []);
    const result = yield vCard_service_1.VCardService.createVCard(vCardData);
    // Send Response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'VCard Created Successfully',
        data: result,
    });
}));
// Get all VCards
const getAllVCards = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, vCard_constants_1.vCardFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, pagination_1.paginationFields);
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield vCard_service_1.VCardService.getAllVCards(filters, paginationOptions, verifiedUser);
    // Send Response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'VCards retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
// Get single VCard by id
const getSingleVCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const id = req.params.id;
    const result = yield vCard_service_1.VCardService.getSingleVCard(verifiedUser, id);
    // Send Response
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get Single VCard Successfully',
        data: result,
    });
}));
// Update VCard
const updateVCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const result = yield vCard_service_1.VCardService.updateVCard(id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'VCard updated successfully',
        data: result,
    });
}));
// Delete VCard
const deleteVCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield vCard_service_1.VCardService.deleteVCard(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'VCard deleted successfully',
        data: result,
    });
}));
exports.VCardController = {
    createVCard,
    getAllVCards,
    getSingleVCard,
    updateVCard,
    deleteVCard,
};
