import express from 'express';
import { VCardController } from './vCard.controller';
import validateRequest from '../../middlewares/validateRequest';
import { VCardValidation } from './vCard.validation';
const router = express.Router();

// Routes
router.post(
  '/create-vCard',
  validateRequest(VCardValidation.createVCardZodValidation),
  VCardController.createVCard
);

router.get('/:id', VCardController.getSingleVCard);

router.delete('/:id', VCardController.deleteVCard);

router.patch(
  '/:id',
  validateRequest(VCardValidation.updateVCardZodValidation),
  VCardController.updateVCard
);

router.get('/', VCardController.getAllVCards);

export const VCardRoutes = router;
