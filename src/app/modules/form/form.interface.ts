import { Model } from 'mongoose';

export type IFormData = {
  type: string;
  placeholder: string;
  name: string;
  required: boolean;
};

export type IForm = {
  email: string;
  formName: string;
  formData: IFormData[];
  moreOptions: boolean;
};

// Form Model
export type FormModel = Model<IForm, Record<string, unknown>>;

export type IFormFilters = {
  searchTerm?: string;
  email?: string;
  formName?: string;
};
