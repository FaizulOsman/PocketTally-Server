/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { SortOrder } from 'mongoose';
import { IVCard, IVCardFilters } from './vCard.interface';
import { VCard } from './vCard.model';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { vCardSearchableFields } from './vCard.constants';
import { IGenericResponse } from '../../../interfaces/common';
// import { User } from '../user/user.model';
import ApiError from '../../../errors/apiError';
import { paginationHelper } from '../../../helper/paginationHelper';
import vCardJS from 'vcards-js';

// Create VCard
const createVCard = async (
  payload: IVCard
  // verifiedUser: any
): Promise<IVCard | null> => {
  const isExist = await VCard.find({
    $and: [{ email: payload?.email }, { formName: payload?.phone }],
  });
  if (isExist.length > 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'You already have a from with this name.'
    );
  }

  const result = await VCard.create(payload);
  return result;
};

// Get All VCards (can also filter)
const getAllVCards = async (
  filters: IVCardFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<IVCard[]>> => {
  // Try not to use any
  const { searchTerm, ...filtersData } = filters;

  const andConditions = []; // Try not to use any

  if (searchTerm) {
    andConditions?.push({
      $or: vCardSearchableFields?.map(field => ({
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

  const result = await VCard.find(
    verifiedUser?.role === 'admin'
      ? whereCondition
      : {
          $and: [whereCondition, { email: verifiedUser?.email }],
        }
  )
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);

  const total = await VCard.countDocuments(
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

// Get Single VCard
const getSingleVCard = async (
  verifiedUser: any,
  id: string
): Promise<IVCard | null> => {
  const findId = await VCard.findOne({ _id: id });
  const vCard = new vCardJS();

  vCard.firstName = findId?.name;
  vCard.email = findId?.email;
  vCard.cellPhone = findId?.phone;
  vCard.url = findId?.website;
  vCard.organization = findId?.company;
  vCard.title = findId?.designation;
  vCard.homeAddress = {
    label: 'Address',
    street: findId?.address,
  };
  vCard.photo.attachFromUrl(findId?.image.url, 'JPEG');

  // Add social media links using custom properties
  findId?.socialMedia.forEach(social => {
    vCard.socialUrls[social.type] = social.url;
  });
  // for (const [key, value] of Object.entries(findId?.socialMedia)) {
  //   vCard.socialUrls[key] = value;
  // }

  vCard.note = findId?.bio;

  return vCard.getFormattedString();
};

const updateVCard = async (
  id: string,
  payload: Partial<IVCard>
): Promise<IVCard | null> => {
  const isExist = await VCard.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'VCard not found');
  }

  const result = await VCard.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

// Delete VCard
const deleteVCard = async (id: string): Promise<IVCard | null> => {
  const result = await VCard.findByIdAndDelete({ _id: id });
  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'VCard Not Found');
  }
  return result;
};

const addReview = async (
  id: string,
  payload: Partial<IVCard>
): Promise<IVCard | null> => {
  const isExist = await VCard.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'VCard not found');
  }

  const result = await VCard.findOneAndUpdate(
    { _id: id },
    { $push: { reviews: payload } },
    {
      new: true,
    }
  ).populate('reviews');

  return result;
};

export const VCardService = {
  createVCard,
  getAllVCards,
  getSingleVCard,
  updateVCard,
  deleteVCard,
  addReview,
};
