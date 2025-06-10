/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { AccountsService } from './accounts.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ICustomerAccount, ITransaction } from './accounts.interface';
import { accountsFilterableFields } from './accounts.constants';
import { paginationFields } from '../../../constants/pagination';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// Create Customer
const createCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.createCustomer(verifiedUser, payload);

    // Send Response
    sendResponse<ICustomerAccount>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customer Created Successfully',
      data: result,
    });
  }
);

// Get all Customers
const getAllCustomers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, accountsFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const user = req.user;

    const result = await AccountsService.getAllCustomers(
      filters,
      paginationOptions,
      user
    );

    // Send Response
    sendResponse<ICustomerAccount[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customers retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get single Customer
const getSingleCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.getSingleCustomer(verifiedUser, id);

    // Send Response
    sendResponse<ICustomerAccount>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customer retrieved Successfully',
      data: result,
    });
  }
);

// Update Customer
const updateCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { ...updateData } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.updateCustomer(
      verifiedUser,
      id,
      updateData
    );

    sendResponse<ICustomerAccount>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customer updated Successfully',
      data: result,
    });
  }
);

// Delete Customer
const deleteCustomer: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.deleteCustomer(verifiedUser, id);

    sendResponse<ICustomerAccount>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Customer deleted Successfully',
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

// Get Customer Transactions
const getCustomerTransactions: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const customerId = req.params.customerId;
    const filters = pick(req.query, accountsFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await AccountsService.getCustomerTransactions(
      verifiedUser,
      customerId,
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
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
  createTransaction,
  getCustomerTransactions,
  updateTransaction,
  deleteTransaction,
};
