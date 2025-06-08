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
    const customerId = Date.now().toString();
    const customer = new CustomerAccount({
      customerId,
      customerName: payload.customerName,
      totalDue: 0,
      recentTransactions: [],
      createdBy: user.id,
    });
    return customer.save();
  }

  static async getAllCustomers(
    filters: any,
    paginationOptions: IPaginationOptions
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

    const result = await CustomerAccount.find(whereConditions)
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await CustomerAccount.countDocuments(whereConditions);

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

    // Add transaction to recent transactions
    customer.recentTransactions.push(transaction);
    if (customer.recentTransactions.length > 10) {
      customer.recentTransactions = customer.recentTransactions.slice(-10);
    }

    await customer.save();
    return transaction;
  }

  static async getCustomerTransactions(
    user: any,
    customerId: string
  ): Promise<ITransaction[]> {
    return Transaction.find({ customerId }).sort({ date: -1 });
  }
}
