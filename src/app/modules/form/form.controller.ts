/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { FormService } from './form.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IForm } from './form.interface';
import { formFilterableFields } from './form.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create Form
const createForm: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { ...formeData } = req.body;

    const result = await FormService.createForm(formeData, verifiedUser);

    // Send Response
    sendResponse<IForm>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Form Created Successfully',
      data: result,
    });
  }
);

// Get all Forms
const getAllForms: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, formFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await FormService.getAllForms(
      filters,
      paginationOptions,
      verifiedUser
    );

    // Send Response
    sendResponse<IForm[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Forms retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single Form by id
const getSingleForm: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await FormService.getSingleForm(id);

    // Send Response
    sendResponse<IForm>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single Form Successfully',
      data: result,
    });
  }
);

// Update Form
const updateForm: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await FormService.updateForm(id, updateData);

  sendResponse<IForm>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Form updated successfully',
    data: result,
  });
});

// Delete Form
const deleteForm: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FormService.deleteForm(id);

  sendResponse<IForm>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Form deleted successfully',
    data: result,
  });
});

export const FormController = {
  createForm,
  getAllForms,
  getSingleForm,
  updateForm,
  deleteForm,
};
