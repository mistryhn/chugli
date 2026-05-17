import { Elysia, t } from 'elysia';

import { userController } from './user.controller';

export const userRoutes = new Elysia({
  prefix: '/users',
})
  .get('/', userController.getUsers)
  .post('/', userController.createUser, {
    body: t.Object({
      name: t.String({
        minLength: 2,
      }),
      email: t.String({
        format: 'email',
      }),
    }),
  });
