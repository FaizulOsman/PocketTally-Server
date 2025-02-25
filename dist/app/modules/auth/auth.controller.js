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
exports.AuthController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../../config"));
const sendOTP = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = __rest(req.body, []);
    yield auth_service_1.AuthService.sendOTP(userData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent successfully',
    });
}));
const createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = __rest(req.body, []);
    const { result, refreshToken, accessToken } = yield auth_service_1.AuthService.createUser(userData);
    // set refresh token in the browser cookie
    const cookieOptions = {
        secure: config_1.default.node_env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Successfully registered',
        data: { result, accessToken },
    });
}));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = __rest(req.body, []);
    const result = yield auth_service_1.AuthService.login(loginData);
    const { refreshToken } = result, accessToken = __rest(result, ["refreshToken"]);
    // set refresh token in the browser cookie
    const cookieOptions = {
        secure: config_1.default.node_env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged in successfully',
        data: accessToken,
    });
}));
const googleLogin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = __rest(req.body, []);
    // For Android App Only
    if ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.androidApp) {
        const _b = yield auth_service_1.AuthService.googleLogin(payload), { refreshToken } = _b, userData = __rest(_b, ["refreshToken"]);
        // set refresh token in the browser cookie
        const cookieOptions = {
            secure: config_1.default.node_env === 'production',
            httpOnly: true,
        };
        res.cookie('refreshToken', refreshToken, cookieOptions);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'Logged in successfully',
            data: userData,
        });
    }
}));
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    // set refresh token in the browser cookie
    const cookieOptions = {
        secure: config_1.default.node_env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New access token generated successfully !',
        data: result,
    });
}));
// Send Email OTP
const sendEmailOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otpData = yield auth_service_1.AuthService.sendEmailOtp(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent successfully',
        data: otpData,
    });
}));
// Verify Email OTP
const verifyEmailOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const response = yield auth_service_1.AuthService.verifyEmailOtp({
        userId: req.user,
        code,
    });
    (0, sendResponse_1.default)(res, Object.assign({ statusCode: http_status_1.default.OK, success: true }, response));
}));
exports.AuthController = {
    sendOTP,
    createUser,
    login,
    googleLogin,
    refreshToken,
    sendEmailOtp,
    verifyEmailOtp,
};
