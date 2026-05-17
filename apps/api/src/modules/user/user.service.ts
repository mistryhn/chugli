import { userRepository } from './user.repository';
import type { CreateUserInput } from './user.schema';

export const userService = {
  async getUsers() {
    return userRepository.findAll();
  },

  async createUser(payload: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(payload.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = await userRepository.create(payload);
    return user;
  },
};
