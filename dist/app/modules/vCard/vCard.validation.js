"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCardValidation = void 0;
const zod_1 = require("zod");
const createVCardZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string(),
        vCardName: zod_1.z.string().optional(),
        vCardData: zod_1.z
            .array(zod_1.z.object({
            type: zod_1.z.string(),
            placeholder: zod_1.z.string(),
            name: zod_1.z.string(),
            required: zod_1.z.boolean(),
        }))
            .optional(),
        moreOptions: zod_1.z.boolean().optional(),
    }),
});
const updateVCardZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().optional(),
        vCardName: zod_1.z.string().optional(),
        vCardData: zod_1.z
            .array(zod_1.z.object({
            type: zod_1.z.string().optional(),
            placeholder: zod_1.z.string().optional(),
            name: zod_1.z.string().optional(),
            required: zod_1.z.boolean().optional(),
        }))
            .optional(),
        moreOptions: zod_1.z.boolean().optional(),
    }),
});
exports.VCardValidation = {
    createVCardZodValidation,
    updateVCardZodValidation,
};
