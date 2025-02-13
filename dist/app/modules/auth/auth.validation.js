"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
            .email('Invalid email format'),
        name: zod_1.z
            .string({
            required_error: 'Name is required',
        })
            .min(5, 'Name must be at least 6 characters long'),
        phone: zod_1.z
            .string({
            required_error: 'Phone number is required',
        })
            .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
        password: zod_1.z
            .string({
            required_error: 'Password is required',
        })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});
const loginUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'email is required',
        })
            .email('Invalid email format'),
        password: zod_1.z
            .string({
            required_error: 'password is required',
        })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});
const refreshTokenZodSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'refreshToken is required',
        }),
    }),
});
exports.authValidation = {
    createUserZodSchema,
    loginUserZodSchema,
    refreshTokenZodSchema,
};
