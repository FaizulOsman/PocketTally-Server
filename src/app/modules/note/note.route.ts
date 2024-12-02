import express from 'express';
import { NoteController } from './note.controller';
import validateRequest from '../../middlewares/validateRequest';
import { NoteValidation } from './note.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

// Routes
router.post(
  '/create',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  validateRequest(NoteValidation.createNoteZodValidation),
  NoteController.createNote
);
router.get(
  '/get-all',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  NoteController.getAllNotes
);
router.get(
  '/get-single/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  NoteController.getSingleNote
);
router.delete(
  '/delete/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  NoteController.deleteNote
);
router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  NoteController.updateNote
);

export const NoteRoutes = router;
