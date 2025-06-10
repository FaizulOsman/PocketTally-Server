/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { AccountsService } from './accounts.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IDebtors, ITransaction } from './accounts.interface';
import { accountsFilterableFields } from './accounts.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create Debtor
const createDebtor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.createDebtor(verifiedUser, payload);

    // Send Response
    sendResponse<IDebtors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Debtor Created Successfully',
      data: result,
    });
  }
);

// Get all Debtors
const getAllDebtors: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, accountsFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await AccountsService.getAllDebtors(
      filters,
      paginationOptions,
      user
    );

    // Send Response
    sendResponse<IDebtors[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Debtors retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single Debtors
const getSingleDebtor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.getSingleDebtor(verifiedUser, id);

    // Send Response
    sendResponse<IDebtors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Debtor retrieved Successfully',
      data: result,
    });
  }
);

// Update Debtors
const updateDebtor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...updateData } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.updateDebtor(
      verifiedUser,
      id,
      updateData
    );

    sendResponse<IDebtors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Debtor updated Successfully',
      data: result,
    });
  }
);

// Delete Debtors
const deleteDebtor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.deleteDebtor(verifiedUser, id);

    sendResponse<IDebtors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Debtor deleted Successfully',
      data: result,
    });
  }
);

// Create Transaction
const createTransaction: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.createTransaction(
      verifiedUser,
      payload
    );

    sendResponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction Created Successfully',
      data: result,
    });
  }
);

// Get Debtor Transactions
const getDebtorTransactions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const debtorId = req.params.debtorId;
    const filters = pick(req.query, accountsFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.getDebtorTransactions(
      verifiedUser,
      debtorId,
      filters,
      paginationOptions
    );

    sendResponse<ITransaction[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactions retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Update Transaction
const updateTransaction: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...updateData } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.updateTransaction(
      verifiedUser,
      id,
      updateData
    );

    sendResponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction updated Successfully',
      data: result,
    });
  }
);

// Delete Transaction
const deleteTransaction: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.deleteTransaction(verifiedUser, id);

    sendResponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction deleted Successfully',
      data: result,
    });
  }
);

export const AccountsController = {
  createDebtor,
  getAllDebtors,
  getSingleDebtor,
  updateDebtor,
  deleteDebtor,
  createTransaction,
  getDebtorTransactions,
  updateTransaction,
  deleteTransaction,
};
