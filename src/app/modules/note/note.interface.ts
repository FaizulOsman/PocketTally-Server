import mongoose, { Model } from 'mongoose';

export type INote = {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
};

// Note Model
export type NoteModel = Model<INote, Record<string, unknown>>;

export type INoteFilters = {
  searchTerm?: string;
  title?: string;
  description?: string;
  dateRange?: string;
};
