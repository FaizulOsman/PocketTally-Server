import express from 'express';
import { FormController } from './form.controller';
import validateRequest from '../../middlewares/validateRequest';
import { FormValidation } from './form.validation';
const router = express.Router();

// Routes
router.post(
  '/create-form',
  validateRequest(FormValidation.createFormZodValidation),
  FormController.createForm
);

router.get('/:id', FormController.getSingleForm);

router.delete('/:id', FormController.deleteForm);

router.patch(
  '/:id',
  validateRequest(FormValidation.updateFormZodValidation),
  FormController.updateForm
);

router.get('/', FormController.getAllForms);

export const FormRoutes = router;
