import { z } from 'zod';
import { noteTypes } from './note.constants';

const createNoteZodValidation = z.object({
  body: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(noteTypes as [string, ...string[]]),
  }),
});

export const NoteValidation = {
  createNoteZodValidation,
};
