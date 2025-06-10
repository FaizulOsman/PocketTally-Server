export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export const accountsFilterableFields = [
  'searchTerm',
  'name',
  'type',
  'date',
  'amount',
];

export const accountsSearchableFields = ['name', 'description'];
