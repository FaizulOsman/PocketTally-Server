/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import { IUser, IUserFilter } from './user.interface';
import { User } from './user.model';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helper/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { UserSearchableFields } from './user.constants';
import httpStatus from 'http-status';
import ApiError from '../../../errors/apiError';
import { JwtPayload } from 'jsonwebtoken';
import { bcryptHelpers } from '../../../helper/bcryptHelpers';
import { Form } from '../form/form.model';
import { Note } from '../note/note.model';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { FormData } from '../formData/formData.model';
import bcrypt from 'bcrypt';
import { Debtor } from '../accounts/accounts.model';

const getAllUsers = async (
  filters: IUserFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: UserSearchableFields?.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: '' | { [key: string]: SortOrder } = sortBy &&
    sortOrder && { [sortBy]: sortOrder };

  const whereCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }

  const { name, ...userData } = payload;
  const updateUserData: Partial<IUser> = { ...userData };

  // dynamically handling nested fields
  if (name && Object.keys(name)?.length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      (updateUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await User.findOneAndUpdate({ _id: id }, updateUserData, {
    new: true,
  });
  return result;
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findOneAndDelete({ _id: id });
  return result;
};

const getMyProfile = async (
  verifiedUser: JwtPayload | null
): Promise<IUser | null> => {
  const result = await User.findById(verifiedUser?.id);

  return result;
};

const updateMyProfile = async (
  user: JwtPayload | null,
  payload: Partial<IUser>
): Promise<IUser | null> => {
  const isExist = await User.findOne({ _id: user?.id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }

  const { password, ...userData } = payload;
  const updateUserData: Partial<IUser> = { ...userData };

  // hash the password before updating
  if (password) {
    (updateUserData as any)['password'] = await bcryptHelpers.hashPassword(
      password
    );
  }

  const result = await User.findOneAndUpdate(
    { _id: user?.id },
    updateUserData,
    {
      new: true,
    }
  );
  return result;
};

const getValidateEmail = async (email: string | undefined) => {
  const result = await User.findOne({
    $or: [{ email: email }, { username: email }],
  });

  return !!result;
};

const updatePassword = async (payload: any): Promise<IUser> => {
  const { userId, currentPassword, newPassword } = payload;
  const user = new User();

  const findUser = await User.findById(userId);
  if (!findUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const isMatch = await user.isPasswordMatch(
    currentPassword,
    findUser?.password
  );
  if (!isMatch)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid current password');

  const salt = await bcrypt.genSalt(10);
  const updatePassword = await bcrypt.hash(newPassword, salt);

  const newUpdatePasswordData = await User.findOneAndUpdate(
    { _id: userId },
    { password: updatePassword },
    { new: true }
  );

  if (!newUpdatePasswordData) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update password'
    );
  }

  return newUpdatePasswordData;
};

const dashboardData = async (verifiedUser: JwtPayload | null) => {
  const findUser = await User.findById(verifiedUser?.id);

  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }

  const tallyCount = await Form.countDocuments(
    verifiedUser?.role === 'admin'
      ? {}
      : {
          user: verifiedUser?.id,
        }
  );
  const noteCount = await Note.countDocuments(
    verifiedUser?.role === 'admin'
      ? {}
      : {
          user: verifiedUser?.id,
        }
  );

  // Fetch all forms for the user
  const forms = await Form.find(
    verifiedUser?.role === 'admin'
      ? {}
      : {
          user: verifiedUser?.id,
        }
  );

  // Prepare tallyData
  const tallyData = await Promise.all(
    forms.map(async form => {
      const data = [];
      for (let i = 0; i < 12; i++) {
        const start = startOfMonth(subMonths(new Date(), i));
        const end = endOfMonth(subMonths(new Date(), i));
        const count = await FormData.countDocuments({
          form: form._id,
          createdAt: { $gte: start, $lte: end },
        });
        data.unshift(count); // Add to the beginning to maintain chronological order
      }
      return { legend: form.formName, data };
    })
  );

  const debtorsCount = await Debtor.countDocuments(
    verifiedUser?.role === 'admin'
      ? {}
      : {
          user: verifiedUser?.id,
        }
  );

  const result = {
    tallyCount,
    noteCount,
    username: findUser?.username,
    tallyData,
    debtorsCount,
  };

  return result;
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  getValidateEmail,
  updatePassword,
  // Dashboard Data
  dashboardData,
};
