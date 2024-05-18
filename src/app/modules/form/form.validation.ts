import { z } from 'zod';

const createFormZodValidation = z.object({
  body: z.object({
    email: z.string(),
    formName: z.string(),
    formData: z.array(
      z.object({
        type: z.string(),
        placeholder: z.string(),
        name: z.string(),
        required: z.boolean(),
      })
    ),
    moreOptions: z.boolean().optional(),
  }),
});

const updateFormZodValidation = z.object({
  body: z.object({
    email: z.string().optional(),
    formName: z.string().optional(),
    formData: z
      .array(
        z.object({
          type: z.string().optional(),
          placeholder: z.string().optional(),
          name: z.string().optional(),
          required: z.boolean().optional(),
        })
      )
      .optional(),
    moreOptions: z.boolean().optional(),
  }),
});

export const FormValidation = {
  createFormZodValidation,
  updateFormZodValidation,
};
