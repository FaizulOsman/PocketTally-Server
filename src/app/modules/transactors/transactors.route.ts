import express from 'express';
import { TransactorsController } from './transactors.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createTransactorSchema,
  createTransactionSchema,
} from './transactors.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Transactor Routes
router.post(
  '/create-transactor',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(createTransactorSchema),
  TransactorsController.createTransactor
);

router.get(
  '/get-all-transactors',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.getAllTransactors
);

router.get(
  '/get-single-transactor/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.getSingleTransactor
);

router.patch(
  '/update-transactor/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.updateTransactor
);

router.delete(
  '/delete-transactor/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.deleteTransactor
);

// Transaction Routes
router.post(
  '/create-transaction',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(createTransactionSchema),
  TransactorsController.createTransaction
);

router.get(
  '/get-transactor-transactions/:transactorId',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.getTransactorTransactions
);

router.patch(
  '/update-transaction/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.updateTransaction
);

router.delete(
  '/delete-transaction/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.deleteTransaction
);

// Get Transactors Total
router.get(
  '/get-transactors-total',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  TransactorsController.getTransactorsTotal
);

export const TransactorsRoutes = router;
