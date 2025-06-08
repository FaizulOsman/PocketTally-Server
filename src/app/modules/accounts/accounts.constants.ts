export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export const accountsFilterableFields = [
  'searchTerm',
  'customerName',
  'type',
  'date',
];

export const accountsSearchableFields = [
  'searchTerm',
  'customerName',
  'type',
  'date',
];
