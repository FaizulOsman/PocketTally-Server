import mongoose, { Schema, model } from 'mongoose';
import {
  ISalesDaily,
  ISalesMonthly,
  SalesDailyModel,
  SalesMonthlyModel,
} from './sales.interface';

const SalesMonthlySchema = new Schema<ISalesMonthly>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    monthId: {
      type: String,
      required: true,
    },
    monthLabel: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Compound index to ensure unique monthId per user
SalesMonthlySchema.index({ user: 1, monthId: 1 }, { unique: true });

const SalesDailySchema = new Schema<ISalesDaily>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    monthId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const SalesMonthly = model<ISalesMonthly, SalesMonthlyModel>(
  'SalesMonthly',
  SalesMonthlySchema
);
export const SalesDaily = model<ISalesDaily, SalesDailyModel>(
  'SalesDaily',
  SalesDailySchema
);
