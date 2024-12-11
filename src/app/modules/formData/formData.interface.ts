import mongoose, { Model } from 'mongoose';

export type IFormData = {
  form: mongoose.Types.ObjectId;
  data: string;
};

// FormData Model
export type FormDataModel = Model<IFormData, Record<string, unknown>>;

export type IFormDataFilters = {
  searchTerm?: string;
  data?: string;
  form?: string | mongoose.Types.ObjectId;
  dateRange?: string;
};
