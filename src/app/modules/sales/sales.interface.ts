import mongoose, { Model } from 'mongoose';

export type ISalesMonthly = {
  user: mongoose.Types.ObjectId;
  monthId: string; // e.g. "2023-10"
  monthLabel: string; // e.g. "October 2023"
  totalAmount: number;
};

export type ISalesDaily = {
  user: mongoose.Types.ObjectId;
  monthId: string;
  date: Date;
  title: string;
  value: number;
};

export type SalesMonthlyModel = Model<ISalesMonthly, Record<string, unknown>>;
export type SalesDailyModel = Model<ISalesDaily, Record<string, unknown>>;

export type ISalesFilters = {
  searchTerm?: string;
  monthId?: string;
  date?: string;
  showAllUsersData?: string;
};
