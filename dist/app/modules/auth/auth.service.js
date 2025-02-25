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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../../../errors/apiError"));
const user_model_1 = require("../user/user.model");
const jwtHelpers_1 = require("../../../helper/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendOTP = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    let accessToken;
    let refreshToken;
    if (result) {
        accessToken = jwtHelpers_1.jwtHelpers.createToken({
            id: result._id,
            role: result.role,
            email: payload.email,
        }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        refreshToken = jwtHelpers_1.jwtHelpers.createToken({
            id: result._id,
            role: result.role,
            email: payload.email,
        }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    }
    return { result, refreshToken, accessToken };
});
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, name, email, phone, gender, imageUrl, password } = payload;
    const findEmail = yield user_model_1.User.findOne({ email });
    if (findEmail)
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already exists');
    const findUsername = yield user_model_1.User.findOne({ username });
    if (findUsername)
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Username already exists');
    const findPhone = yield user_model_1.User.findOne({ phone });
    if (findPhone)
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Phone number already exists');
    const result = yield user_model_1.User.create({
        username,
        name,
        email,
        phone,
        gender,
        imageUrl,
        password,
    });
    let accessToken;
    let refreshToken;
    if (result) {
        accessToken = jwtHelpers_1.jwtHelpers.createToken({
            id: result._id,
            role: result.role,
            email: payload.email,
        }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
        refreshToken = jwtHelpers_1.jwtHelpers.createToken({
            id: result._id,
            role: result.role,
            email: payload.email,
        }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    }
    return { result, refreshToken, accessToken };
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.User();
    const isUserExist = yield user_model_1.User.findOne({
        $or: [{ email: payload.email }, { username: payload.email }],
    });
    if (!isUserExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (payload.password &&
        !(yield user.isPasswordMatch(payload.password, isUserExist.password))) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid password');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isUserExist._id,
        role: isUserExist.role,
        email: payload.email,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        id: isUserExist._id,
        role: isUserExist.role,
        email: payload.email,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    const userData = yield user_model_1.User.findOne({ _id: isUserExist._id });
    return {
        userData,
        accessToken,
        refreshToken,
    };
});
const googleLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = payload;
    const tokenInfoRes = yield fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!tokenInfoRes.ok) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid Google token');
    }
    const data = yield tokenInfoRes.json();
    const findUser = yield user_model_1.User.findOne({ email: data === null || data === void 0 ? void 0 : data.email });
    if (!findUser) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Please register!');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
        role: findUser === null || findUser === void 0 ? void 0 : findUser.role,
        email: data.email,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        id: findUser === null || findUser === void 0 ? void 0 : findUser._id,
        role: findUser === null || findUser === void 0 ? void 0 : findUser.role,
        email: data.email,
    }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        userData: findUser,
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new apiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid refresh token');
    }
    const { id, role } = verifiedToken;
    // check if user exists of not
    const isUserExist = yield user_model_1.User.findOne({ _id: id });
    if (!isUserExist) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: id,
        role: role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const sendEmailOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload;
    const findUser = yield user_model_1.User.findOne({ email });
    if (findUser) {
        throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already exists');
    }
    // Generate a 6-digit random OTP
    const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();
    const otp = generateOTP();
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_KEY,
        },
    });
    const mailOptions = {
        from: process.env.GMAIL_ID,
        to: email,
        subject: 'OTP',
        text: `Your verification code is: ${otp}`,
    };
    yield transporter.sendMail(mailOptions);
    return otp;
});
const verifyEmailOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, code } = payload;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.otp !== code) {
        throw new apiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired OTP');
    }
    // Clear the OTP after successful verification
    user.otp = undefined;
    yield user.save();
    return { message: 'OTP verified successfully!', action: 'verified' };
});
exports.AuthService = {
    sendOTP,
    createUser,
    login,
    googleLogin,
    refreshToken,
    sendEmailOtp,
    verifyEmailOtp,
};
