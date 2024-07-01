import { Model } from 'mongoose';

export type ISocialMedia = {
  type: string;
  url: string;
};

export type IVCard = {
  image: {
    url: string;
    publicUrl: string;
  };
  name: string;
  email: string;
  phone: string;
  website: string;
  designation: string;
  company: string;
  address: string;
  bio: string;
  socialMedia: ISocialMedia[];
  isEmailActive: boolean;
  isProfileSetup: boolean;
};

// VCard Model
export type VCardModel = Model<IVCard, Record<string, unknown>>;

export type IVCardFilters = {
  searchTerm?: string;
  email?: string;
  vCardName?: string;
};
