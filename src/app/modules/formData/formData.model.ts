import mongoose, { Schema, model } from 'mongoose';
import { IFormData, FormDataModel } from './formData.interface';

// FormData Schema
const FormDataSchema = new Schema<IFormData>(
  {
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
      required: true,
    },
    data: {
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

export const FormData = model<IFormData, FormDataModel>(
  'FormData',
  FormDataSchema
);
