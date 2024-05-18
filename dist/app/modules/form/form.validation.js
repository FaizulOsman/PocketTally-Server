"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormValidation = void 0;
const zod_1 = require("zod");
const createFormZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string(),
        formName: zod_1.z.string(),
        formData: zod_1.z.array(zod_1.z.object({
            type: zod_1.z.string(),
            placeholder: zod_1.z.string(),
            name: zod_1.z.string(),
            required: zod_1.z.boolean(),
        })),
        moreOptions: zod_1.z.boolean().optional(),
    }),
});
const updateFormZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().optional(),
        formName: zod_1.z.string().optional(),
        formData: zod_1.z
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
exports.FormValidation = {
    createFormZodValidation,
    updateFormZodValidation,
};
