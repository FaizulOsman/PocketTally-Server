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
import { ObjectId } from 'mongodb';

// Create Form
const createForm = async (
  payload: IForm,
  verifiedUser: any
): Promise<IForm | null> => {
  const { formName, formData } = payload;

  const user = await User.find({ _id: verifiedUser?.id });
  if (user.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isExist = await Form.find({
    $and: [{ user: verifiedUser?.id }, { formName: payload?.formName }],
  });
  if (isExist.length > 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'You already have a from with this name.'
    );
  }

  const result = await Form.create({
    user: verifiedUser?.id,
    formName,
    formData,
  });
  return result;
};

// Get All Forms (can also filter)
const getAllForms = async (
  filters: IFormFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<IForm[]>> => {
  const { searchTerm, dateRange, ...filtersData } = filters;

  const andConditions: Record<string, any>[] = [];

  // Add search term filtering
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

  // Add filters data conditions
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Add date range filter if available and valid
  if (dateRange) {
    const [startDate, endDate] = dateRange
      .split('-')
      .map(date => new Date(date.trim()));

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      andConditions.push({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } | '' =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : '';

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Form.find(
    verifiedUser?.role === 'admin'
      ? whereCondition
      : {
          $and: [whereCondition, { user: verifiedUser?.id }],
        }
  )
    .populate({ path: 'user', select: 'email' })
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await Form.countDocuments(
    verifiedUser?.role === 'admin'
      ? whereCondition
      : {
          $and: [whereCondition, { user: verifiedUser?.id }],
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
    const form = await Form.findById({ _id: id });

    if (new ObjectId(form?.user).toHexString() !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'You are not authorized to access this!'
      );
    }
  }

  const result = await Form.findById({ _id: id });

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
  const result = await Form.findByIdAndDelete({ _id: id });
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
