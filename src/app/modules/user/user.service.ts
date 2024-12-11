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
  const result = await User.findOne({ email: verifiedUser?.email });

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
  const result = await User.findOne({ email });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
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
          email: verifiedUser?.email,
        }
  );
  const noteCount = await Note.countDocuments(
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
  // Dashboard Data
  dashboardData,
};
