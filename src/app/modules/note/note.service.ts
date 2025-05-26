/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { SortOrder } from 'mongoose';
import { INote, INoteFilters } from './note.interface';
import { Note } from './note.model';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { noteSearchableFields } from './note.constants';
import { IGenericResponse } from '../../../interfaces/common';
import { User } from '../user/user.model';
import ApiError from '../../../errors/apiError';
import { paginationHelper } from '../../../helper/paginationHelper';
import { ObjectId } from 'mongodb';

// Create
const createNote = async (
  verifiedUser: any,
  payload: INote
): Promise<INote | null> => {
  const { title, description, type } = payload;

  const findUser = await User.findById(verifiedUser?.id);
  if (!findUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isExist = await Note.find({ user: verifiedUser?.id, title });
  if (isExist.length > 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'You already have a note with this title!'
    );
  }

  const result = await Note.create({
    user: verifiedUser?.id,
    title,
    description,
    type,
  });
  return result;
};

// Get All
const getAllNotes = async (
  filters: INoteFilters,
  paginationOptions: IPaginationOptions,
  verifiedUser: any
): Promise<IGenericResponse<INote[]>> => {
  const { searchTerm, dateRange, ...filtersData } = filters;

  const andConditions: Record<string, any>[] = [];

  // Add search term filtering
  if (searchTerm) {
    andConditions?.push({
      $or: noteSearchableFields?.map(field => ({
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

  const query = Note.find(
    verifiedUser?.role === 'admin'
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

  const total = await Note.countDocuments(
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

// Get Single
const getSingleNote = async (
  verifiedUser: any,
  id: string
): Promise<INote | null> => {
  const findNote = await Note.findById(id);

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findNote?.user).toHexString();

    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'You are not authorized to access the data!'
      );
    }
  }

  return findNote;
};

// Update
const updateNote = async (
  verifiedUser: any,
  id: string,
  payload: Partial<INote>
): Promise<INote | null> => {
  const { title, description, type } = payload;

  const findNote = await Note.findById(id);
  if (!findNote) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Note not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findNote?.user).toHexString();

    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'You are not authorized to access the data!'
      );
    }
  }

  const result = await Note.findOneAndUpdate(
    { _id: id },
    {
      title: title || findNote?.title,
      description: description || findNote?.description,
      type: type || findNote?.type,
    },
    {
      new: true,
    }
  );

  return result;
};

// Delete
const deleteNote = async (
  id: string,
  verifiedUser: any
): Promise<INote | null> => {
  const findNote = await Note.findById(id);
  if (!findNote) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Note not found');
  }

  if (verifiedUser?.role !== 'admin') {
    const userId = new ObjectId(findNote?.user).toHexString();

    if (userId !== verifiedUser?.id) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'You are not authorized to access the data!'
      );
    }
  }

  const result = await Note.findByIdAndDelete({ _id: id });
  if (!result) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Note Not Found');
  }
  return result;
};

export const NoteService = {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
