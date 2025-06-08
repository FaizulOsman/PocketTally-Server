import express from 'express';
import { AccountsController } from './accounts.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createCustomerSchema,
  createTransactionSchema,
} from './accounts.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Customer Routes
router.post(
  '/create-customer',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(createCustomerSchema),
  AccountsController.createCustomer
);

router.get(
  '/get-all-customers',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.getAllCustomers
);

router.get(
  '/get-single-customer/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.getSingleCustomer
);

router.patch(
  '/update-customer/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.updateCustomer
);

router.delete(
  '/delete-customer/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.deleteCustomer
);

// Transaction Routes
router.post(
  '/create-transaction',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(createTransactionSchema),
  AccountsController.createTransaction
);

router.get(
  '/get-customer-transactions/:customerId',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  AccountsController.getCustomerTransactions
);

export const AccountsRoutes = router;
