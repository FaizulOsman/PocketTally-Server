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
import { Form } from '../form/form.model';

// Create
const createData = async (
  payload: IFormData,
  verifiedUser: any
): Promise<IFormData | null> => {
  const user = await User.find({ _id: verifiedUser.id });
  if (user.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const form = await Form.findOne({ _id: payload?.formId });

  if (!form || !form?.formData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }

  const parsedData = JSON.parse(payload?.data);
  const relationFields = form?.formData?.filter(f => f?.relation);

  // Validate required fields
  form.formData.forEach((field: any) => {
    if (field.required && !(field.name in parsedData)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Missing required field: ${field.name}`
      );
    }
  });

  // Process relations
  relationFields?.forEach(field => {
    const [field1, operator, field2] = field.relation.split(/([-+*/])/); // Split "Sales-Cost" into ["Sales", "-", "Cost"]
    const value1 = parsedData[field1.trim()];
    const value2 = parsedData[field2.trim()];

    // Perform the operation
    if (value1 !== undefined && value2 !== undefined) {
      switch (operator) {
        case '+':
          parsedData[field.name] = value1 + value2;
          break;
        case '-':
          parsedData[field.name] = value1 - value2;
          break;
        case '*':
          parsedData[field.name] = value1 * value2;
          break;
        case '/':
          parsedData[field.name] = value2 !== 0 ? value1 / value2 : null; // Prevent division by zero
          break;
        default:
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Invalid relation operator: ${operator}`
          );
      }
    }
  });

  // Update payload data
  payload.data = JSON.stringify(parsedData);

  // Create new data entry
  const result = await FormData.create(payload);
  return result;
};

// Get All
const getAllData = async (
  filters: IFormDataFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IFormData[]>> => {
  const { searchTerm, dateRange, ...filtersData } = filters;

  const andConditions: Record<string, any>[] = [];

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

  let result = await FormData.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await FormData.countDocuments(whereCondition);

  // Dynamically sort based on keys in the "data" property
  const parsedSortKey = sortBy?.startsWith('data.')
    ? sortBy.replace('data.', '')
    : null;

  if (parsedSortKey) {
    result = result.sort((a, b) => {
      const dataA = JSON.parse(a.data);
      const dataB = JSON.parse(b.data);

      const valueA = dataA[parsedSortKey];
      const valueB = dataB[parsedSortKey];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return Number(sortOrder) === 1 ? valueA - valueB : valueB - valueA;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return Number(sortOrder) === 1
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }

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
  // const formData = await FormData.findById({ _id: id });
  // console.log(formData);
  // if (formData?.userEmail !== verifiedUser?.email) {
  //   throw new ApiError(
  //     httpStatus.NOT_FOUND,
  //     'You are not authorized to access this!'
  //   );
  // }

  const result = await FormData.findById({ _id: id });

  return result;
};

const updateData = async (
  id: string,
  payload: Partial<IFormData>
): Promise<IFormData | null> => {
  const existingData = await FormData.findOne({ _id: id });
  if (!existingData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Form not found');
  }

  const form = await Form.findOne({ _id: existingData.formId });
  if (!form || !form.formData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Form not found');
  }

  const existingParsedData = JSON.parse(existingData.data);
  const updatedParsedData = JSON.parse(payload.data || '{}');

  const fullData = { ...existingParsedData, ...updatedParsedData };

  const relationFields = form.formData.filter(f => f.relation);
  relationFields.forEach(field => {
    const [field1, operator, field2] = field.relation.split(/([-+*/])/);
    const value1 = fullData[field1.trim()];
    const value2 = fullData[field2.trim()];

    if (value1 !== undefined && value2 !== undefined) {
      switch (operator) {
        case '+':
          fullData[field.name] = value1 + value2;
          break;
        case '-':
          fullData[field.name] = value1 - value2;
          break;
        case '*':
          fullData[field.name] = value1 * value2;
          break;
        case '/':
          fullData[field.name] = value2 !== 0 ? value1 / value2 : null;
          break;
        default:
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Invalid relation operator: ${operator}`
          );
      }
    }
  });

  payload.data = JSON.stringify(fullData);

  const result = await FormData.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

// Delete Single
const deleteData = async (id: string): Promise<IFormData | null> => {
  const result = await FormData.findByIdAndDelete({ _id: id });
  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Data Not Found');
  }
  return result;
};

// Delete Many
const deleteMany = async (id: string): Promise<any> => {
  const result = await FormData.deleteMany({ formId: id });
  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Data Not Found');
  }
  return result;
};

export const FormDataService = {
  createData,
  getAllData,
  getSingleData,
  updateData,
  deleteData,
  deleteMany,
};
