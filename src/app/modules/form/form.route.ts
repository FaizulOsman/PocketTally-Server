import express from 'express';
import { FormController } from './form.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FormValidation } from './form.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

// Routes
router.post(
  '/create-form',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FormValidation.createFormZodValidation),
  FormController.createForm
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FormController.getSingleForm
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FormController.deleteForm
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FormValidation.updateFormZodValidation),
  FormController.updateForm
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FormController.getAllForms
);

export const FormRoutes = router;
