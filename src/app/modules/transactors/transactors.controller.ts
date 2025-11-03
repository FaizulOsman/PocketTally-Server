/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { TransactorsService } from './transactors.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ITransactors, ITransaction } from './transactors.interface';
import { transactorsFilterableFields } from './transactors.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create Transactor
const createTransactor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await TransactorsService.createTransactor(
      verifiedUser,
      payload
    );

    // Send Response
    sendResponse<ITransactors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactor Created Successfully',
      data: result,
    });
  }
);

// Get all Transactors
const getAllTransactors: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, transactorsFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await TransactorsService.getAllTransactors(
      filters,
      paginationOptions,
      user
    );

    // Send Response
    sendResponse<ITransactors[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactors retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single Transactors
const getSingleTransactor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await TransactorsService.getSingleTransactor(
      verifiedUser,
      id
    );

    // Send Response
    sendResponse<ITransactors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactor retrieved Successfully',
      data: result,
    });
  }
);

// Update Transactors
const updateTransactor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...updateData } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await TransactorsService.updateTransactor(
      verifiedUser,
      id,
      updateData
    );

    sendResponse<ITransactors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactor updated Successfully',
      data: result,
    });
  }
);

// Delete Transactors
const deleteTransactor: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await TransactorsService.deleteTransactor(verifiedUser, id);

    sendResponse<ITransactors>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactor deleted Successfully',
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

    const result = await TransactorsService.createTransaction(
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

// Get Transactor Transactions
const getTransactorTransactions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const transactorId = req.params.transactorId;
    const filters = pick(req.query, transactorsFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await TransactorsService.getTransactorTransactions(
      verifiedUser,
      transactorId,
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

    const result = await TransactorsService.updateTransaction(
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

    const result = await TransactorsService.deleteTransaction(verifiedUser, id);

    sendResponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction deleted Successfully',
      data: result,
    });
  }
);

// Get Transactors Total
const getTransactorsTotal: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );
    const { showAllUsersData } = req.query;

    const result = await TransactorsService.getTransactorsTotal(
      verifiedUser,
      showAllUsersData
    );

    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactors total retrieved Successfully',
      data: result,
    });
  }
);

export const TransactorsController = {
  createTransactor,
  getAllTransactors,
  getSingleTransactor,
  updateTransactor,
  deleteTransactor,
  createTransaction,
  getTransactorTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactorsTotal,
};
