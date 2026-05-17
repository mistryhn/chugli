import type { CreateUserInput } from './user.schema';
import { userService } from './user.service';

export const userController = {
  async getUsers() {
    const users = await userService.getUsers();

    return {
      success: true,
      data: users,
    };
  },

  async createUser({ body }: { body: CreateUserInput }) {
    const user = await userService.createUser(body);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  },
};
