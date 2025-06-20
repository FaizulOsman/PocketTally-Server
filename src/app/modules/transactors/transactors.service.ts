import { Transactor, Transaction } from './transactors.model';
import { ITransactors, ITransaction } from './transactors.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helper/paginationHelper';
import { SortOrder } from 'mongoose';
import { ObjectId } from 'mongodb';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

export class TransactorsService {
  static async createTransactor(
    user: any,
    payload: ITransactors
  ): Promise<ITransactors> {
    if (!user?.id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'User ID is required to create a transactor'
      );
    }

    if (!payload?.name?.trim()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name is required');
    }

    const findTransactor = await Transactor.findOne({
      name: payload?.name,
      user: user?.id,
    });
    if (findTransactor) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Transactor name already exist!'
      );
    }

    const transactor = new Transactor({
      user: user.id,
      name: payload?.name.trim(),
      phoneNumber: payload?.phoneNumber?.trim(),
      description: payload?.description?.trim(),
      type: payload?.type.trim(),
      totalDue: 0,
    });

    const savedTransactor = await transactor.save();
    return savedTransactor;
  }

  static async getAllTransactors(
    filters: any,
    paginationOptions: IPaginationOptions,
    user: any
  ): Promise<IGenericResponse<ITransactors[]>> {
    const { searchTerm, type, showAllUsersData, ...filtersData } = filters;
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

    if (type) {
      andConditions.push({
        type: {
          $in: type || 'debtor',
        },
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

    const result = await Transactor.find(
      user?.role === 'admin' && showAllUsersData === 'true'
        ? whereConditions
        : {
            $and: [whereConditions, { user: user?.id }],
          }
    )
      .populate({ path: 'user', select: 'email' })
      .sort(sortConditions)
      .skip(skip)
      .limit(limit);

    const total = await Transactor.countDocuments(
      user?.role === 'admin' && showAllUsersData === 'true'
        ? whereConditions
        : {
            $and: [whereConditions, { user: user?.id }],
          }
    );

    // --- Calculate calculatedAmount for each transactor ---
    const transactorIds = result.map(t => t._id);
    const transactionSums = await Transaction.aggregate([
      { $match: { transactorId: { $in: transactorIds } } },
      {
        $group: {
          _id: '$transactorId',
          credit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'CREDIT'] }, '$amount', 0],
            },
          },
          debit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'DEBIT'] }, '$amount', 0],
            },
          },
        },
      },
    ]);
    const sumMap: Record<string, { credit: number; debit: number }> = {};
    transactionSums.forEach(item => {
      sumMap[item._id.toString()] = {
        credit: item.credit || 0,
        debit: item.debit || 0,
      };
    });
    const resultWithCalculatedAmount = result.map(transactor => {
      const sums = sumMap[transactor._id.toString()] || { credit: 0, debit: 0 };

      return {
        ...transactor.toObject(),
        calculatedAmount: sums.credit - sums.debit,
      };
    });
    // --- End calculatedAmount logic ---

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: resultWithCalculatedAmount,
    };
  }

  static async getSingleTransactor(
    verifiedUser: any,
    id: string
  ): Promise<ITransactors | null> {
    const findTransactor = await Transactor.findById(id);

    if (verifiedUser?.role !== 'admin') {
      const userId = new ObjectId(findTransactor?.user).toHexString();

      if (userId !== verifiedUser?.id) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'You are not authorized to access the data!'
        );
      }
    }

    return findTransactor;
  }

  static async updateTransactor(
    user: any,
    id: string,
    payload: Partial<ITransactors>
  ): Promise<ITransactors | null> {
    const findTransactor = await Transactor.findById(id);
    if (!findTransactor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transactor not found');
    }

    if (user?.role !== 'admin') {
      const userId = new ObjectId(findTransactor?.user).toHexString();
      if (userId !== user?.id) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          'You are not authorized to update this transactor!'
        );
      }
    }

    // If transactor name is being updated, check for duplicates
    if (payload.name) {
      const existingTransactor = await Transactor.findOne({
        name: payload.name,
        user: user.id,
        _id: { $ne: id },
      });
      if (existingTransactor) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Transactor name already exists!'
        );
      }
    }

    const result = await Transactor.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    ).populate({ path: 'user', select: 'email' });

    return result;
  }

  static async deleteTransactor(
    user: any,
    id: string
  ): Promise<ITransactors | null> {
    return Transactor.findOneAndDelete({ transactorId: id });
  }

  static async createTransaction(
    user: any,
    payload: ITransaction
  ): Promise<ITransaction> {
    const transaction = new Transaction({
      ...payload,
      createdBy: user.id,
    });
    await transaction.save();

    const transactor = await Transactor.findById(payload?.transactorId);
    if (!transactor) {
      throw new Error('Transactor not found');
    }

    // Update Transactors total due
    const amountChange =
      payload.type === 'CREDIT' ? payload.amount : -payload.amount;
    transactor.totalDue += amountChange;
    transactor.lastTransactionDate = payload.date;

    await transactor.save();
    return transaction;
  }

  static async getTransactorTransactions(
    user: any,
    transactorId: string,
    filters: any,
    paginationOptions: IPaginationOptions
  ): Promise<IGenericResponse<ITransaction[]>> {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];

    // Base condition for transactorId
    andConditions.push({
      transactorId: new ObjectId(transactorId),
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

    const transactor = await Transactor.findById(transaction.transactorId);
    if (!transactor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transactor not found');
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

    // Update transactors total due
    if (transaction.type === 'CREDIT') {
      transactor.totalDue += amountDifference;
    } else {
      transactor.totalDue -= amountDifference;
    }

    await transactor.save();
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

    const transactor = await Transactor.findById(transaction.transactorId);
    if (!transactor) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Transactor not found');
    }

    // Update transactors total due
    if (transaction.type === 'CREDIT') {
      transactor.totalDue -= transaction.amount;
    } else {
      transactor.totalDue += transaction.amount;
    }

    await transactor.save();
    return Transaction.findByIdAndDelete(id);
  }
}
