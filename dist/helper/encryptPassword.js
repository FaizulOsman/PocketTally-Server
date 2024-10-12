"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = void 0;
/* eslint-disable @typescript-eslint/no-inferrable-types */
const bcrypt_1 = __importDefault(require("bcrypt"));
function encryptPassword(plainPassword, saltRounds = 10) {
    return bcrypt_1.default.hashSync(plainPassword, saltRounds);
}
exports.encryptPassword = encryptPassword;
