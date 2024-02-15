/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { SortOrder } from 'mongoose';
import { IForm, IFormFilters } from './form.interface';
import { Form } from './form.model';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { formSearchableFields } from './form.constants';
import { IGenericResponse } from '../../../interfaces/common';
import { User } from '../user/user.model';
import ApiError from '../../../errors/apiError';
import { paginationHelper } from '../../../helper/paginationHelper';

// Create Form
const createForm = async (
  payload: IForm,
  verifiedUser: any
): Promise<IForm | null> => {
  const user = await User.find({ _id: verifiedUser.id });
  if (user.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isExist = await Form.find({
    $and: [{ email: payload?.email }, { formName: payload?.formName }],
  });
  console.log('Already Exist: ', isExist);
  if (isExist.length > 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'You already have a from with this name.'
    );
  }

  const result = await Form.create(payload);
  return result;
};

// Get All Forms (can also filter)
const getAllForms = async (
  filters: IFormFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<IForm[]>> => {
  // Try not to use any
  const { searchTerm, ...filtersData } = filters;

  const andConditions = []; // Try not to use any

  if (searchTerm) {
    andConditions?.push({
      $or: formSearchableFields?.map(field => ({
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

  const result = await Form.find(
    verifiedUser?.role === 'admin'
      ? whereCondition
      : {
          $and: [whereCondition, { email: verifiedUser?.email }],
        }
  )
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Form.countDocuments(
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

// Get Single Form
const getSingleForm = async (
  verifiedUser: any,
  id: string
): Promise<IForm | null> => {
  if (verifiedUser?.role !== 'admin') {
    const form = await Form.findById(id);
    console.log(form);
    if (form?.email !== verifiedUser?.email) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'You are not authorized to access this!'
      );
    }
  }

  const result = await Form.findById(id);

  return result;
};

const updateForm = async (
  id: string,
  payload: Partial<IForm>
): Promise<IForm | null> => {
  const isExist = await Form.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form not found');
  }

  const result = await Form.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

// Delete Form
const deleteForm = async (id: string): Promise<IForm | null> => {
  const result = await Form.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Form Not Found');
  }
  return result;
};

const addReview = async (
  id: string,
  payload: Partial<IForm>
): Promise<IForm | null> => {
  const isExist = await Form.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form not found');
  }

  const result = await Form.findOneAndUpdate(
    { _id: id },
    { $push: { reviews: payload } },
    {
      new: true,
    }
  ).populate('reviews');

  return result;
};

export const FormService = {
  createForm,
  getAllForms,
  getSingleForm,
  updateForm,
  deleteForm,
  addReview,
};
