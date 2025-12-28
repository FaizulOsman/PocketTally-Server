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
exports.SalesController = void 0;
const sales_service_1 = require("./sales.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const sales_constants_1 = require("./sales.constants");
const config_1 = __importDefault(require("../../../config"));
const pick_1 = require("../../../shared/pick");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
// =========================================================
// Monthly Sales Controller
// =========================================================
const createSalesMonthly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = __rest(req.body, []);
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.createSalesMonthly(verifiedUser, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Monthly Sales Record Created Successfully',
        data: result,
    });
}));
const getAllSalesMonthly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, sales_constants_1.salesFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, sales_constants_1.salesPaginationFields);
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.getAllSalesMonthly(filters, paginationOptions, verifiedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Monthly Sales Records retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleSalesMonthly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const id = req.params.id;
    const result = yield sales_service_1.SalesService.getSingleSalesMonthly(verifiedUser, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get Single Monthly Sales Record Successfully',
        data: result,
    });
}));
const updateSalesMonthly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.updateSalesMonthly(verifiedUser, id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Monthly Sales Record updated successfully',
        data: result,
    });
}));
const deleteSalesMonthly = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.deleteSalesMonthly(id, verifiedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Monthly Sales Record deleted successfully',
        data: result,
    });
}));
// =========================================================
// Daily Sales Controller
// =========================================================
const createSalesDaily = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = __rest(req.body, []);
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.createSalesDaily(verifiedUser, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transaction Created Successfully',
        data: result,
    });
}));
const getAllSalesDaily = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.pick)(req.query, sales_constants_1.salesFilterableFields);
    const paginationOptions = (0, pick_1.pick)(req.query, sales_constants_1.salesPaginationFields);
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.getAllSalesDaily(filters, paginationOptions, verifiedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transactions retrieved Successfully',
        meta: result.meta,
        data: result.data,
    });
}));
const getSingleSalesDaily = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const id = req.params.id;
    const result = yield sales_service_1.SalesService.getSingleSalesDaily(verifiedUser, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Get Single Transaction Successfully',
        data: result,
    });
}));
const updateSalesDaily = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.updateSalesDaily(verifiedUser, id, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transaction updated successfully',
        data: result,
    });
}));
const deleteSalesDaily = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const result = yield sales_service_1.SalesService.deleteSalesDaily(id, verifiedUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Transaction deleted successfully',
        data: result,
    });
}));
exports.SalesController = {
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
