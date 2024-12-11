import mongoose, { Model } from 'mongoose';

export type IFormData = {
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
  relation: string;
};

export type IForm = {
  user: mongoose.Types.ObjectId;
  formName: string;
  formData: IFormData[];
  moreOptions: boolean;
};

// Form Model
export type FormModel = Model<IForm, Record<string, unknown>>;

export type IFormFilters = {
  searchTerm?: string;
  formName?: string;
  dateRange?: string;
};
