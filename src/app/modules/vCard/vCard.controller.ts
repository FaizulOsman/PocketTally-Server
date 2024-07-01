/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { VCardService } from './vCard.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IVCard } from './vCard.interface';
import { vCardFilterableFields } from './vCard.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create VCard
const createVCard: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const { ...vCardeData } = req.body;

    const result = await VCardService.createVCard(vCardeData, verifiedUser);

    // Send Response
    sendResponse<IVCard>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'VCard Created Successfully',
      data: result,
    });
  }
);

// Get all VCards
const getAllVCards: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, vCardFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await VCardService.getAllVCards(
      filters,
      paginationOptions,
      verifiedUser
    );

    // Send Response
    sendResponse<IVCard[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'VCards retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single VCard by id
const getSingleVCard: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const id = req.params.id;
    const result = await VCardService.getSingleVCard(verifiedUser, id);

    // Send Response
    sendResponse<IVCard>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single VCard Successfully',
      data: result,
    });
  }
);

// Update VCard
const updateVCard: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const result = await VCardService.updateVCard(id, updateData);

  sendResponse<IVCard>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'VCard updated successfully',
    data: result,
  });
});

// Delete VCard
const deleteVCard: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await VCardService.deleteVCard(id);

  sendResponse<IVCard>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'VCard deleted successfully',
    data: result,
  });
});

export const VCardController = {
  createVCard,
  getAllVCards,
  getSingleVCard,
  updateVCard,
  deleteVCard,
};
