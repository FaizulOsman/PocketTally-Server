import { Schema, model } from 'mongoose';
import { IVCard, VCardModel } from './vCard.interface';

// VCard Schema
const VCardSchema = new Schema<IVCard>(
  {
    image: {
      url: { type: String, required: true, unique: true },
      publicUrl: { type: String, required: true },
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    website: { type: String, required: true },
    designation: { type: String, required: true },
    company: { type: String, required: true },
    address: { type: String, required: true },
    bio: { type: String, required: true },
    socialMedia: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    isEmailActive: {
      type: Boolean,
      required: true,
    },
    isProfileSetup: {
      type: Boolean,
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

export const VCard = model<IVCard, VCardModel>('VCard', VCardSchema);
