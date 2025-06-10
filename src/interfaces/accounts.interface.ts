export type IAccountTransaction = {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ICustomerAccount = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  totalDue: number;
  lastTransactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IAccountSummary = {
  customerId: string;
  customerName: string;
  totalDue: number;
  lastTransactionDate: Date;
};
