/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortOrder } from 'mongoose';
import { ISalesDaily, ISalesMonthly, ISalesFilters } from './sales.interface';
import { SalesDaily, SalesMonthly } from './sales.model';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { salesSearchableFields } from './sales.constants';
import { IGenericResponse } from '../../../interfaces/common';
import { User } from '../user/user.model';
import ApiError from '../../../errors/apiError';
import { paginationHelper } from '../../../helper/paginationHelper';
import { ObjectId } from 'mongodb';

// =========================================================
// Monthly Sales Services
// =========================================================

const createSalesMonthly = async (
  verifiedUser: any,
  payload: ISalesMonthly
): Promise<ISalesMonthly | null> => {
  const { monthId } = payload;

  const findUser = await User.findById(verifiedUser?.id);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isExist = await SalesMonthly.findOne({
    user: verifiedUser?.id,
    monthId,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Sales record for this month already exists!'
    );
  }

  const result = await SalesMonthly.create({
    ...payload,
    user: verifiedUser?.id,
  });
  return result;
};

const getAllSalesMonthly = async (
  filters: ISalesFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<ISalesMonthly[]>> => {
  const { searchTerm, showAllUsersData, ...filtersData } = filters;
  const andConditions: Record<string, any>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: salesSearchableFields.map(field => ({
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

  const sortCondition: { [key: string]: SortOrder } | '' =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : '';

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const query = SalesMonthly.find(
    verifiedUser?.role === 'admin' && showAllUsersData === 'true'
      ? whereCondition
      : {
          $and: [whereCondition, { user: verifiedUser?.id }],
        }
  )
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  if (verifiedUser?.role === 'admin') {
    query.populate({ path: 'user', select: 'email' });
  }

  const result = await query;
  const total = await SalesMonthly.countDocuments(
    verifiedUser?.role === 'admin' && showAllUsersData === 'true'
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

const getSingleSalesMonthly = async (
  verifiedUser: any,
  id: string
): Promise<ISalesMonthly | null> => {
  const findData = await SalesMonthly.findById(id);
  if (!findData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findData?.user).toHexString();
    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to access this data!'
      );
    }
  }

  return findData;
};

const updateSalesMonthly = async (
  verifiedUser: any,
  id: string,
  payload: Partial<ISalesMonthly>
): Promise<ISalesMonthly | null> => {
  const findData = await SalesMonthly.findById(id);
  if (!findData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findData?.user).toHexString();
    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update this data!'
      );
    }
  }

  const result = await SalesMonthly.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteSalesMonthly = async (
  id: string,
  verifiedUser: any
): Promise<ISalesMonthly | null> => {
  const findData = await SalesMonthly.findById(id);
  if (!findData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findData?.user).toHexString();
    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to delete this data!'
      );
    }
  }

  // Delete all daily transactions for this month
  await SalesDaily.deleteMany({
    user: findData.user,
    monthId: findData.monthId,
  });

  const result = await SalesMonthly.findByIdAndDelete(id);
  return result;
};

// =========================================================
// Daily Sales Services
// =========================================================

const createSalesDaily = async (
  verifiedUser: any,
  payload: ISalesDaily
): Promise<ISalesDaily | null> => {
  const { monthId, value } = payload;

  const findUser = await User.findById(verifiedUser?.id);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Ensure monthly record exists or create/update it
  // Using findOneAndUpdate with upsert to handle race conditions or missing months
  await SalesMonthly.findOneAndUpdate(
    { user: verifiedUser?.id, monthId },
    {
      $inc: { totalAmount: value },
      $setOnInsert: {
        user: verifiedUser?.id,
        monthId,
        monthLabel: (payload as any).monthLabel || monthId, // Basic fallback
      },
    },
    { upsert: true, new: true }
  );

  const result = await SalesDaily.create({
    ...payload,
    user: verifiedUser?.id,
  });
  return result;
};

const getAllSalesDaily = async (
  filters: ISalesFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<ISalesDaily[]>> => {
  const { searchTerm, showAllUsersData, ...filtersData } = filters;
  const andConditions: Record<string, any>[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: ['title'].map(field => ({
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

  const sortCondition: { [key: string]: SortOrder } | '' =
    sortBy && sortOrder ? { [sortBy]: sortOrder } : '';

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const query = SalesDaily.find(
    verifiedUser?.role === 'admin' && showAllUsersData === 'true'
      ? whereCondition
      : {
          $and: [whereCondition, { user: verifiedUser?.id }],
        }
  )
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  if (verifiedUser?.role === 'admin') {
    query.populate({ path: 'user', select: 'email' });
  }

  const result = await query;
  const total = await SalesDaily.countDocuments(
    verifiedUser?.role === 'admin' && showAllUsersData === 'true'
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

const getSingleSalesDaily = async (
  verifiedUser: any,
  id: string
): Promise<ISalesDaily | null> => {
  const findData = await SalesDaily.findById(id);
  if (!findData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findData?.user).toHexString();
    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to access this data!'
      );
    }
  }

  return findData;
};

const updateSalesDaily = async (
  verifiedUser: any,
  id: string,
  payload: Partial<ISalesDaily>
): Promise<ISalesDaily | null> => {
  const findData = await SalesDaily.findById(id);
  if (!findData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findData?.user).toHexString();
    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update this data!'
      );
    }
  }

  // Calculate difference if value is changing
  if (payload.value !== undefined && payload.value !== findData.value) {
    const diff = payload.value - findData.value;
    await SalesMonthly.findOneAndUpdate(
      { user: findData.user, monthId: findData.monthId },
      { $inc: { totalAmount: diff } }
    );
  }

  // Handle monthId change (move transaction to another month)
  if (payload.monthId && payload.monthId !== findData.monthId) {
    // Remove value from old month
    await SalesMonthly.findOneAndUpdate(
      { user: findData.user, monthId: findData.monthId },
      { $inc: { totalAmount: -findData.value } }
    );
    // Add value to new month (new value or old value)
    const newValue =
      payload.value !== undefined ? payload.value : findData.value;
    await SalesMonthly.findOneAndUpdate(
      { user: findData.user, monthId: payload.monthId },
      { $inc: { totalAmount: newValue } },
      { upsert: true }
    );
  }

  const result = await SalesDaily.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteSalesDaily = async (
  id: string,
  verifiedUser: any
): Promise<ISalesDaily | null> => {
  const findData = await SalesDaily.findById(id);
  if (!findData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findData?.user).toHexString();
    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to delete this data!'
      );
    }
  }

  // Decrease monthly total
  await SalesMonthly.findOneAndUpdate(
    { user: findData.user, monthId: findData.monthId },
    { $inc: { totalAmount: -findData.value } }
  );

  const result = await SalesDaily.findByIdAndDelete(id);
  return result;
};

export const SalesService = {
  createSalesMonthly,
  getAllSalesMonthly,
  getSingleSalesMonthly,
  updateSalesMonthly,
  deleteSalesMonthly,
  createSalesDaily,
  getAllSalesDaily,
  getSingleSalesDaily,
  updateSalesDaily,
  deleteSalesDaily,
};
