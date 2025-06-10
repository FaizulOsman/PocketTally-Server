import { Debtor, Transaction } from './accounts.model';
import {
  IDebtors,
  ICreateDebtorDto,
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
  static async createDebtor(
    user: any,
    payload: ICreateDebtorDto
  ): Promise<IDebtors> {
    if (!user?.id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'User ID is required to create a debtor'
      );
    }

    if (!payload?.name?.trim()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name is required');
    }

    const findDebtor = await Debtor.findOne({
      name: payload?.name,
      user: user?.id,
    });
    if (findDebtor) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Debtor name already exist!');
    }

    const debtor = new Debtor({
      user: user.id,
      name: payload?.name.trim(),
      phoneNumber: payload?.phoneNumber?.trim(),
      description: payload?.description?.trim(),
      totalDue: 0,
    });

    const savedDebtor = await debtor.save();
    return savedDebtor;
  }

  static async getAllDebtors(
    filters: any,
    paginationOptions: IPaginationOptions,
    user: any
  ): Promise<IGenericResponse<IDebtors[]>> {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];

    if (searchTerm) {
      andConditions.push({
        $or: [
          {
            name: {
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

    const result = await Debtor.find(
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

    const total = await Debtor.countDocuments(
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

  static async getSingleDebtor(
    verifiedUser: any,
    id: string
  ): Promise<IDebtors | null> {
    const findDebtor = await Debtor.findById(id);

    if (verifiedUser?.role !== 'admin') {
      const userId = new ObjectId(findDebtor?.user).toHexString();

      if (userId !== verifiedUser?.id) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'You are not authorized to access the data!'
        );
      }
    }

    return findDebtor;
  }

  static async updateDebtor(
    user: any,
    id: string,
    payload: Partial<IDebtors>
  ): Promise<IDebtors | null> {
    const findDebtor = await Debtor.findById(id);
    if (!findDebtor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Debtor not found');
    }

    if (user?.role !== 'admin') {
      const userId = new ObjectId(findDebtor?.user).toHexString();
      if (userId !== user?.id) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'You are not authorized to update this debtor!'
        );
      }
    }

    // If debtor name is being updated, check for duplicates
    if (payload.name) {
      const existingDebtor = await Debtor.findOne({
        name: payload.name,
        user: user.id,
        _id: { $ne: id },
      });
      if (existingDebtor) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Debtor name already exists!'
        );
      }
    }

    const result = await Debtor.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    ).populate({ path: 'user', select: 'email' });

    return result;
  }

  static async deleteDebtor(user: any, id: string): Promise<IDebtors | null> {
    return Debtor.findOneAndDelete({ debtorId: id });
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

    const debtor = await Debtor.findById(payload?.debtorId);
    if (!debtor) {
      throw new Error('Debtor not found');
    }

    // Update debtors total due
    const amountChange =
      payload.type === 'CREDIT' ? payload.amount : -payload.amount;
    debtor.totalDue += amountChange;
    debtor.lastTransactionDate = payload.date;

    await debtor.save();
    return transaction;
  }

  static async getDebtorTransactions(
    user: any,
    debtorId: string,
    filters: any,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<ITransaction[]>> {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];

    // Base condition for debtorId
    andConditions.push({
      debtorId: new ObjectId(debtorId),
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

    const debtor = await Debtor.findById(transaction.debtorId);
    if (!debtor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Debtor not found');
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

    // Update debtors total due
    if (transaction.type === 'CREDIT') {
      debtor.totalDue += amountDifference;
    } else {
      debtor.totalDue -= amountDifference;
    }

    await debtor.save();
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

    const debtor = await Debtor.findById(transaction.debtorId);
    if (!debtor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Debtor not found');
    }

    // Update debtors total due
    if (transaction.type === 'CREDIT') {
      debtor.totalDue -= transaction.amount;
    } else {
      debtor.totalDue += transaction.amount;
    }

    await debtor.save();
    return Transaction.findByIdAndDelete(id);
  }
}
