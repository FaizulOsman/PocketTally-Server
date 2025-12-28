import { z } from 'zod';

const createSalesMonthlyZodValidation = z.object({
  body: z.object({
    monthId: z.string({
      required_error: 'Month ID is required',
    }),
    monthLabel: z.string({
      required_error: 'Month Label is required',
    }),
    totalAmount: z.number().optional(),
  }),
});

const updateSalesMonthlyZodValidation = z.object({
  body: z.object({
    monthId: z.string().optional(),
    monthLabel: z.string().optional(),
    totalAmount: z.number().optional(),
  }),
});

const createSalesDailyZodValidation = z.object({
  body: z.object({
    monthId: z.string({
      required_error: 'Month ID is required',
    }),
    date: z.string({
      required_error: 'Date is required',
    }), // Zod parses dates from strings
    title: z.string({
      required_error: 'Title is required',
    }),
    value: z.number({
      required_error: 'Value is required',
    }),
  }),
});

const updateSalesDailyZodValidation = z.object({
  body: z.object({
    monthId: z.string().optional(),
    date: z.string().optional(),
    title: z.string().optional(),
    value: z.number().optional(),
  }),
});

export const SalesValidation = {
  createSalesMonthlyZodValidation,
  updateSalesMonthlyZodValidation,
  createSalesDailyZodValidation,
  updateSalesDailyZodValidation,
};
