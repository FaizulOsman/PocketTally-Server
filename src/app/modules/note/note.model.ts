import mongoose, { Schema, model } from 'mongoose';
import { INote, NoteModel } from './note.interface';

// Note Schema
const NoteSchema = new Schema<INote>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Note = model<INote, NoteModel>('Note', NoteSchema);
