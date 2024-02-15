import { Model } from 'mongoose';

export type IFormData = {
  formId: string;
  data: string;
};

// FormData Model
export type FormDataModel = Model<IFormData, Record<string, unknown>>;

export type IFormDataFilters = {
  searchTerm?: string;
  userEmail?: string;
  formId?: string;
};
