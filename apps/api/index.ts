import { Elysia } from 'elysia';
import { env } from '@/config/env';
import { authRoutes } from '@/modules/auth/auth.route';
import { userRoutes } from '@/modules/user/user.route';
import { errorPlugin } from '@/plugins/error.plugin';

const app = new Elysia({ prefix: '/api' })
  .use(errorPlugin)
  .get('/health', () => ({
    success: true,
    message: 'Health Ok',
  }))
  .use(authRoutes)
  .use(userRoutes)
  .listen(Number(env.PORT));

console.log(
  `🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
