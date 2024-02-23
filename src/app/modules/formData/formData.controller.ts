/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { FormDataService } from './formData.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { formDataFilterableFields } from './formData.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create
const createData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { ...formData } = req.body;

    const result = await FormDataService.createData(formData, verifiedUser);

    // Send Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Data Created Successfully',
      data: result,
    });
  }
);

// Get all
const getAllData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, formDataFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await FormDataService.getAllData(
      filters,
      paginationOptions,
      verifiedUser
    );

    // Send Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Data retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single
const getSingleData: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const id = req.params.id;
    const result = await FormDataService.getSingleData(verifiedUser, id);

    // Send Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single Data Successfully',
      data: result,
    });
  }
);

// Update
const updateData: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await FormDataService.updateData(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data updated successfully',
    data: result,
  });
});

// Delete Single
const deleteData: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FormDataService.deleteData(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data deleted successfully',
    data: result,
  });
});

// Delete Many
const deleteMany: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FormDataService.deleteMany(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Data deleted successfully',
    data: result,
  });
});

export const FormDataController = {
  createData,
  getAllData,
  getSingleData,
  updateData,
  deleteData,
  deleteMany,
};
