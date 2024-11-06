import { Schema, model } from 'mongoose';
import { IForm, FormModel } from './form.interface';

// Form Schema
const FormSchema = new Schema<IForm>(
  {
    email: {
      type: String,
      required: true,
    },
    formName: {
      type: String,
      required: true,
    },
    formData: {
      type: [
        {
          type: {
            type: String,
            required: true,
          },
          placeholder: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          required: {
            type: Boolean,
            required: true,
          },
          relation: {
            type: String,
          },
        },
      ],
      required: true,
    },
    moreOptions: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Form = model<IForm, FormModel>('Form', FormSchema);
