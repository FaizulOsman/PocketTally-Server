export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export const accountsFilterableFields = [
  'searchTerm',
  'customerName',
  'type',
  'date',
  'amount',
];

export const accountsSearchableFields = ['customerName', 'description'];
