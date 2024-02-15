/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { SortOrder } from 'mongoose';
import { IFormData, IFormDataFilters } from './formData.interface';
import { FormData } from './formData.model';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { formDataSearchableFields } from './formData.constants';
import { IGenericResponse } from '../../../interfaces/common';
import { User } from '../user/user.model';
import ApiError from '../../../errors/apiError';
import { paginationHelper } from '../../../helper/paginationHelper';

// Create
const createData = async (
  payload: IFormData,
  verifiedUser: any
): Promise<IFormData | null> => {
  const user = await User.find({ _id: verifiedUser.id });
  if (user.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await FormData.create(payload);
  return result;
};

// Get All
const getAllData = async (
  filters: IFormDataFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<IFormData[]>> => {
  // Try not to use any
  const { searchTerm, ...filtersData } = filters;

  const andConditions = []; // Try not to use any

  if (searchTerm) {
    andConditions?.push({
      $or: formDataSearchableFields?.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        return { [field]: value };
      }),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: '' | { [key: string]: SortOrder } = sortBy &&
    sortOrder && { [sortBy]: sortOrder };

  const whereCondition =
    andConditions?.length > 0 ? { $and: andConditions } : {};

  const result = await FormData.find(
    verifiedUser?.role === 'admin'
      ? whereCondition
      : {
          $and: [whereCondition, { email: verifiedUser?.email }],
        }
  )
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await FormData.countDocuments(
    verifiedUser?.role === 'admin'
      ? whereCondition
      : {
          $and: [whereCondition, { email: verifiedUser?.email }],
        }
  );

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// Get Single
const getSingleData = async (
  verifiedUser: any,
  id: string
): Promise<IFormData | null> => {
  // const formData = await FormData.findById(id);
  // console.log(formData);
  // if (formData?.userEmail !== verifiedUser?.email) {
  //   throw new ApiError(
  //     httpStatus.NOT_FOUND,
  //     'You are not authorized to access this!'
  //   );
  // }

  const result = await FormData.findById(id);

  return result;
};

const updateData = async (
  id: string,
  payload: Partial<IFormData>
): Promise<IFormData | null> => {
  const isExist = await FormData.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form not found');
  }

  const result = await FormData.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

// Delete Form
const deleteData = async (id: string): Promise<IFormData | null> => {
  const result = await FormData.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Form Not Found');
  }
  return result;
};

export const FormDataService = {
  createData,
  getAllData,
  getSingleData,
  updateData,
  deleteData,
};
