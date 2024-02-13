import express from 'express';
import { AuthRouter } from '../modules/auth/auth.router';
import { UserRoutes } from '../modules/user/user.router';
import { FormRoutes } from '../modules/form/form.route';

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
];

moduleRoutes?.forEach(route => router.use(route?.path, route?.route));

export default router;
