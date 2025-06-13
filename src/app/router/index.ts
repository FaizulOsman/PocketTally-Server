import express from 'express';
import { AuthRouter } from '../modules/auth/auth.router';
import { UserRoutes } from '../modules/user/user.router';
import { FormRoutes } from '../modules/form/form.route';
import { FormDataRoutes } from '../modules/formData/formData.route';
import { VCardRoutes } from '../modules/vCard/vCard.route';
import { NoteRoutes } from '../modules/note/note.route';
import { TransactorsRoutes } from '../modules/transactors/transactors.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/forms',
    route: FormRoutes,
  },
  {
    path: '/formData',
    route: FormDataRoutes,
  },
  {
    path: '/vCard',
    route: VCardRoutes,
  },
  {
    path: '/notes',
    route: NoteRoutes,
  },
  {
    path: '/transactors',
    route: TransactorsRoutes,
  },
];

moduleRoutes?.forEach(route => router.use(route?.path, route?.route));

export default router;
