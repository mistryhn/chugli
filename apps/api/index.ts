import { Elysia } from 'elysia';
import { userRoutes } from '@/modules/user/user.route';
import { errorPlugin } from '@/plugins/error.plugin';

const app = new Elysia()
  .use(errorPlugin)
  .get('/', () => ({
    success: true,
    message: 'API running',
  }))
  .use(userRoutes)
  .listen(3000);

console.log(
  `🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
