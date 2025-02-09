/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { role } from './user.constants';
import bcrypt from 'bcrypt';
import config from '../../../config';
const { Schema } = mongoose;

const userSchema = new Schema<IUser, UserModel>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: role },
    address: { type: String },
    imageUrl: { type: String },
    dob: { type: String },
    pincode: { type: Number },
    gender: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Exclude password field from the response
      },
    },
  }
);

userSchema.methods.isUserExist = async function (
  email: string
): Promise<Pick<IUser, 'role' | 'password' | '_id'> | null> {
  return await this.model('User')
    .findOne({ email: email }, { _id: 1, role: 1, password: 1 })
    .select('+password');
};

userSchema.methods.isPasswordMatch = function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
  // hash the password before saving into the database
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
