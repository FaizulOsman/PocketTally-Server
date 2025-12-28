import express from 'express';
import { SalesController } from './sales.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SalesValidation } from './sales.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// =========================================================
// Monthly Sales Routes
// =========================================================

router.post(
  '/monthly/create',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SalesValidation.createSalesMonthlyZodValidation),
  SalesController.createSalesMonthly
);

router.get(
  '/monthly/get-all',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SalesController.getAllSalesMonthly
);

router.get(
  '/monthly/get-single/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SalesController.getSingleSalesMonthly
);

router.patch(
  '/monthly/update/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SalesValidation.updateSalesMonthlyZodValidation),
  SalesController.updateSalesMonthly
);

router.delete(
  '/monthly/delete/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SalesController.deleteSalesMonthly
);

// =========================================================
// Daily Sales Routes
// =========================================================

router.post(
  '/daily/create',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SalesValidation.createSalesDailyZodValidation),
  SalesController.createSalesDaily
);

router.get(
  '/daily/get-all',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SalesController.getAllSalesDaily
);

router.get(
  '/daily/get-single/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SalesController.getSingleSalesDaily
);

router.patch(
  '/daily/update/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SalesValidation.updateSalesDailyZodValidation),
  SalesController.updateSalesDaily
);

router.delete(
  '/daily/delete/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SalesController.deleteSalesDaily
);

export const SalesRoutes = router;
