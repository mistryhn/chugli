import { Elysia, t } from 'elysia';
import { authController } from './auth.controller';

export const authRoutes = new Elysia({
  prefix: '/auth',
})
  .post('/register', authController.register, {
    body: t.Object({
      name: t.String({
        minLength: 2,
        maxLength: 50,
      }),
      email: t.String({
        format: 'email',
      }),
      password: t.String({
        minLength: 8,
        maxLength: 128,
      }),
    }),
  })
  .post('/login', authController.login, {
    body: t.Object({
      email: t.String({
        format: 'email',
      }),
      password: t.String({
        minLength: 1,
        maxLength: 128,
      }),
    }),
  })
  .get('/me', authController.me);
