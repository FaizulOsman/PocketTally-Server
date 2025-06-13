export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const;

export const transactorsFilterableFields = [
  'searchTerm',
  'name',
  'type',
  'date',
  'amount',
  'showAllUsersData',
];

export const transactorsSearchableFields = ['name', 'description'];
