import express from 'express';
import { AccountsController } from './accounts.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createDebtorSchema,
  createTransactionSchema,
} from './accounts.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Debtor Routes
router.post(
  '/create-debtor',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(createDebtorSchema),
  AccountsController.createDebtor
);

router.get(
  '/get-all-debtors',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.getAllDebtors
);

router.get(
  '/get-single-debtor/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.getSingleDebtor
);

router.patch(
  '/update-debtor/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.updateDebtor
);

router.delete(
  '/delete-debtor/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.deleteDebtor
);

// Transaction Routes
router.post(
  '/create-transaction',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(createTransactionSchema),
  AccountsController.createTransaction
);

router.get(
  '/get-debtor-transactions/:debtorId',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.getDebtorTransactions
);

router.patch(
  '/update-transaction/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.updateTransaction
);

router.delete(
  '/delete-transaction/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.deleteTransaction
);

export const AccountsRoutes = router;
