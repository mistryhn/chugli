import { Elysia } from 'elysia';

import { userController } from './user.controller';

export const userRoutes = new Elysia({
  prefix: '/users',
}).get('/', userController.getUsers);
