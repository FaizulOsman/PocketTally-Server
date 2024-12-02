import { z } from 'zod';

const createNoteZodValidation = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const NoteValidation = {
  createNoteZodValidation,
};
