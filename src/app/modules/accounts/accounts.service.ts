import { CustomerAccount, Transaction } from './accounts.model';
import {
  ICustomerAccount,
  ICreateCustomerDto,
  ICreateTransactionDto,
  ITransaction,
} from './accounts.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helper/paginationHelper';
import { SortOrder } from 'mongoose';
import { ObjectId } from 'mongodb';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

export class AccountsService {
  static async createCustomer(
    user: any,
    payload: ICreateCustomerDto
  ): Promise<ICustomerAccount> {
    if (!user?.id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'User ID is required to create a customer'
      );
    }

    if (!payload.customerName?.trim()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Customer name is required');
    }

    const findCustomer = await CustomerAccount.findOne({
      customerName: payload.customerName,
      user: user?.id,
    });
    if (findCustomer) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Customer name already exist!'
      );
    }

    const customer = new CustomerAccount({
      user: user.id,
      customerName: payload.customerName.trim(),
      phoneNumber: payload.phoneNumber?.trim(),
      description: payload.description?.trim(),
      totalDue: 0,
    });

    const savedCustomer = await customer.save();
    return savedCustomer;
  }

  static async getAllCustomers(
    filters: any,
    paginationOptions: IPaginationOptions,
    user: any
  ): Promise<IGenericResponse<ICustomerAccount[]>> {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];

    if (searchTerm) {
      andConditions.push({
        $or: [
          {
            customerName: {
              $regex: searchTerm,
              $options: 'i',
            },
          },
        ],
      });
    }

    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    }

    const result = await CustomerAccount.find(
      user?.role === 'admin'
        ? whereConditions
        : {
            $and: [whereConditions, { user: user?.id }],
          }
    )
      .populate({ path: 'user', select: 'email' })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await CustomerAccount.countDocuments(
      user?.role === 'admin'
        ? whereConditions
        : {
            $and: [whereConditions, { user: user?.id }],
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
  }

  static async getSingleCustomer(
    verifiedUser: any,
    id: string
  ): Promise<ICustomerAccount | null> {
    const findCustomer = await CustomerAccount.findById(id);

    if (verifiedUser?.role !== 'admin') {
      const userId = new ObjectId(findCustomer?.user).toHexString();

      if (userId !== verifiedUser?.id) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'You are not authorized to access the data!'
        );
      }
    }

    return findCustomer;
  }

  static async updateCustomer(
    user: any,
    id: string,
    payload: Partial<ICustomerAccount>
  ): Promise<ICustomerAccount | null> {
    return CustomerAccount.findOneAndUpdate(
      { customerId: id },
      { $set: payload },
      { new: true }
    );
  }

  static async deleteCustomer(
    user: any,
    id: string
  ): Promise<ICustomerAccount | null> {
    return CustomerAccount.findOneAndDelete({ customerId: id });
  }

  static async createTransaction(
    user: any,
    payload: ICreateTransactionDto
  ): Promise<ITransaction> {
    const transaction = new Transaction({
      ...payload,
      createdBy: user.id,
    });
    await transaction.save();

    const customer = await CustomerAccount.findById(payload?.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Update customer's total due
    const amountChange =
      payload.type === 'CREDIT' ? payload.amount : -payload.amount;
    customer.totalDue += amountChange;
    customer.lastTransactionDate = payload.date;

    await customer.save();
    return transaction;
  }

  static async getCustomerTransactions(
    user: any,
    customerId: string,
    filters: any,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<ITransaction[]>> {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];

    // Base condition for customerId
    andConditions.push({
      customerId: new ObjectId(customerId),
    });

    if (searchTerm) {
      andConditions.push({
        $or: [
          {
            description: {
              $regex: searchTerm,
              $options: 'i',
            },
          },
        ],
      });
    }

    if (Object.keys(filtersData).length) {
      andConditions.push({
        $and: Object.entries(filtersData).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }

    const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.calculatePagination(paginationOptions);

    const sortConditions: { [key: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
    } else {
      // Default sort by date in descending order
      sortConditions['date'] = -1;
    }

    const result = await Transaction.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(whereConditions);

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  static async updateTransaction(
    user: any,
    id: string,
    payload: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    const customer = await CustomerAccount.findById(transaction.customerId);
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }

    // Calculate the difference in amount
    const oldAmount = transaction.amount;
    const newAmount = payload.amount || oldAmount;
    const amountDifference = newAmount - oldAmount;

    // Update transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { ...payload },
      { new: true }
    );

    // Update customer's total due
    if (transaction.type === 'CREDIT') {
      customer.totalDue += amountDifference;
    } else {
      customer.totalDue -= amountDifference;
    }

    await customer.save();
    return updatedTransaction;
  }

  static async deleteTransaction(
    user: any,
    id: string
  ): Promise<ITransaction | null> {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
    }

    const customer = await CustomerAccount.findById(transaction.customerId);
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
    }

    // Update customer's total due
    if (transaction.type === 'CREDIT') {
      customer.totalDue -= transaction.amount;
    } else {
      customer.totalDue += transaction.amount;
    }

    await customer.save();
    return Transaction.findByIdAndDelete(id);
  }
}
