import { authService } from '@/modules/auth/auth.service';
import { userService } from './user.service';

export const userController = {
  async getUsers({ request }: { request: Request }) {
    await authService.authenticateRequest(request);
    const users = await userService.getUsers();

    return {
      success: true,
      data: users,
    };
  },
};
