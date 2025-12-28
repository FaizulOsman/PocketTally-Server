"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesValidation = void 0;
const zod_1 = require("zod");
const createSalesMonthlyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        monthId: zod_1.z.string({
            required_error: 'Month ID is required',
        }),
        monthLabel: zod_1.z.string({
            required_error: 'Month Label is required',
        }),
        totalAmount: zod_1.z.number().optional(),
    }),
});
const updateSalesMonthlyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        monthId: zod_1.z.string().optional(),
        monthLabel: zod_1.z.string().optional(),
        totalAmount: zod_1.z.number().optional(),
    }),
});
const createSalesDailyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        monthId: zod_1.z.string({
            required_error: 'Month ID is required',
        }),
        date: zod_1.z.string({
            required_error: 'Date is required',
        }),
        title: zod_1.z.string({
            required_error: 'Title is required',
        }),
        value: zod_1.z.number({
            required_error: 'Value is required',
        }),
    }),
});
const updateSalesDailyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        monthId: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        value: zod_1.z.number().optional(),
    }),
});
exports.SalesValidation = {
    createSalesMonthlyZodValidation,
    updateSalesMonthlyZodValidation,
    createSalesDailyZodValidation,
    updateSalesDailyZodValidation,
};
