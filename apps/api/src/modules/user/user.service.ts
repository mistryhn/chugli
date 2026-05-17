import { userRepository } from './user.repository';

function toSafeUser<T extends { password: string }>(user: T) {
  const { ...safeUser } = user;
  return safeUser;
}

export const userService = {
  async getUsers() {
    const users = await userRepository.findAll();
    return users.map(toSafeUser);
  },
};
