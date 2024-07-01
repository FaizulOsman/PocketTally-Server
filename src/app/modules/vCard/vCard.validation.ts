import { z } from 'zod';

const createVCardZodValidation = z.object({
  body: z.object({
    email: z.string(),
    vCardName: z.string().optional(),
    vCardData: z
      .array(
        z.object({
          type: z.string(),
          placeholder: z.string(),
          name: z.string(),
          required: z.boolean(),
        })
      )
      .optional(),
    moreOptions: z.boolean().optional(),
  }),
});

const updateVCardZodValidation = z.object({
  body: z.object({
    email: z.string().optional(),
    vCardName: z.string().optional(),
    vCardData: z
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

export const VCardValidation = {
  createVCardZodValidation,
  updateVCardZodValidation,
};
