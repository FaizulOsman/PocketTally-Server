/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, RequestHandler, Response } from 'express';
import { SalesService } from './sales.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ISalesDaily, ISalesMonthly } from './sales.interface';
import {
  salesFilterableFields,
  salesPaginationFields,
} from './sales.constants';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { pick } from '../../../shared/pick';
import { jwtHelpers } from '../../../helper/jwtHelpers';

// =========================================================
// Monthly Sales Controller
// =========================================================

const createSalesMonthly: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await SalesService.createSalesMonthly(verifiedUser, payload);

    sendResponse<ISalesMonthly>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Monthly Sales Record Created Successfully',
      data: result,
    });
  }
);

const getAllSalesMonthly: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, salesFilterableFields);
    const paginationOptions = pick(req.query, salesPaginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await SalesService.getAllSalesMonthly(
      filters,
      paginationOptions,
      verifiedUser
    );

    sendResponse<ISalesMonthly[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Monthly Sales Records retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleSalesMonthly: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const id = req.params.id;
    const result = await SalesService.getSingleSalesMonthly(verifiedUser, id);

    sendResponse<ISalesMonthly>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single Monthly Sales Record Successfully',
      data: result,
    });
  }
);

const updateSalesMonthly: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await SalesService.updateSalesMonthly(
    verifiedUser,
    id,
    updateData
  );

  sendResponse<ISalesMonthly>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Monthly Sales Record updated successfully',
    data: result,
  });
});

const deleteSalesMonthly: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await SalesService.deleteSalesMonthly(id, verifiedUser);

  sendResponse<ISalesMonthly>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Monthly Sales Record deleted successfully',
    data: result,
  });
});

// =========================================================
// Daily Sales Controller
// =========================================================

const createSalesDaily: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await SalesService.createSalesDaily(verifiedUser, payload);

    sendResponse<ISalesDaily>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction Created Successfully',
      data: result,
    });
  }
);

const getAllSalesDaily: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, salesFilterableFields);
    const paginationOptions = pick(req.query, salesPaginationFields);

    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const result = await SalesService.getAllSalesDaily(
      filters,
      paginationOptions,
      verifiedUser
    );

    sendResponse<ISalesDaily[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transactions retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleSalesDaily: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const token: any = req.headers.authorization;
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      config.jwt.secret as Secret
    );

    const id = req.params.id;
    const result = await SalesService.getSingleSalesDaily(verifiedUser, id);

    sendResponse<ISalesDaily>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Single Transaction Successfully',
      data: result,
    });
  }
);

const updateSalesDaily: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await SalesService.updateSalesDaily(
    verifiedUser,
    id,
    updateData
  );

  sendResponse<ISalesDaily>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction updated successfully',
    data: result,
  });
});

const deleteSalesDaily: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;

  const token: any = req.headers.authorization;
  const verifiedUser = jwtHelpers.verifyToken(
    token,
    config.jwt.secret as Secret
  );

  const result = await SalesService.deleteSalesDaily(id, verifiedUser);

  sendResponse<ISalesDaily>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction deleted successfully',
    data: result,
  });
});

export const SalesController = {
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
