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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = __importDefault(require("mongoose"));
const user_constants_1 = require("./user.constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    username: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    role: { type: String, enum: user_constants_1.role, default: 'user' },
    address: { type: String },
    imageUrl: { type: String },
    dob: { type: String },
    pincode: { type: Number },
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password; // Exclude password field from the response
        },
    },
});
userSchema.methods.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.model('User')
            .findOne({ email: email }, { _id: 1, role: 1, password: 1 })
            .select('+password');
    });
};
userSchema.methods.isPasswordMatch = function (givenPassword, savedPassword) {
    return bcrypt_1.default.compare(givenPassword, savedPassword);
};
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hash the password before saving into the database
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
exports.User = mongoose_1.default.model('User', userSchema);
