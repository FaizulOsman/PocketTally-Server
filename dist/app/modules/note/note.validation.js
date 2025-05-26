"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteValidation = void 0;
const zod_1 = require("zod");
const note_constants_1 = require("./note.constants");
const createNoteZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        type: zod_1.z.enum(note_constants_1.noteTypes),
    }),
});
exports.NoteValidation = {
    createNoteZodValidation,
};
