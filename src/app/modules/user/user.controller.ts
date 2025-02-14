/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import { UserService } from './user.service';
import { pick } from '../../../shared/pick';
import { UserFilterableFields } from './user.constants';
import { paginationFields } from '../../../constants/pagination';
import { jwtHelpers } from '../../../helper/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/apiError';

const getAllUser: RequestHandler = catchAsync(async (req, res) => {
  const filters = pick(req.query, UserFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await UserService.getAllUsers(filters, paginationOptions);
  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserService.getSingleUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Retrived successfully',
    data: result,
  });
});

const updateUser: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await UserService.updateUser(id, updateData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user updated successfully',
    data: result,
  });
});

const deleteUser: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserService.deleteUser(id);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user deleted successfully',
    data: result,
  });
});

const getMyProfile: RequestHandler = catchAsync(async (req, res) => {
  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );
  const result = await UserService.getMyProfile(verifiedUser);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's information retrieved successfully",
    data: result,
  });
});

const updateMyProfile: RequestHandler = catchAsync(async (req, res) => {
  const { ...updateData } = req.body;
  const user = req.user;

  const result = await UserService.updateMyProfile(user, updateData);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's information updated successfully",
    data: result,
  });
});

const getValidateEmail: RequestHandler = catchAsync(async (req, res) => {
  const { email } = req.query;

  // Type check to ensure `email` is a string
  if (typeof email !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid email format');
  }

  await UserService.getValidateEmail(email);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email found successfully',
  });
});

export const updatePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.user as { id: string };

  await UserService.updatePassword({
    userId: id,
    currentPassword,
    newPassword,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully',
  });
});

const dashboardData: RequestHandler = catchAsync(async (req, res) => {
  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await UserService.dashboardData(verifiedUser);

  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard data retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getAllUser,
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
