import { HttpError } from '@/lib/http-error';
import { userRepository } from '@/modules/user/user.repository';
import type { IUser } from '@/modules/user/user.type';
import type { LoginInput, RegisterInput } from './auth.schema';
import { createAccessToken, verifyAccessToken } from './jwt';

type SafeUser = Omit<IUser, 'password'>;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toSafeUser(user: IUser): SafeUser {
  const { ...safeUser } = user;
  return safeUser;
}

function authResponse(user: IUser) {
  return {
    user: user,
    token: createAccessToken(user),
  };
}

export const authService = {
  async register(payload: RegisterInput) {
    const email = normalizeEmail(payload.email);
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new HttpError(409, 'User already exists');
    }
    const password = await Bun.password.hash(payload.password, {
      algorithm: 'argon2id',
    });
    const user = await userRepository.create({
      name: payload.name.trim(),
      email,
      password,
    });
    if (!user) {
      throw new HttpError(500, 'Something went wrong.');
    }
    return authResponse(user);
  },

  async login(payload: LoginInput) {
    const user = await userRepository.findByEmail(
      normalizeEmail(payload.email),
    );

    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const isValidPassword = await Bun.password
      .verify(payload.password, user.password)
      .catch(() => false);

    if (!isValidPassword) {
      throw new HttpError(401, 'Invalid email or password');
    }

    return authResponse(user);
  },

  async authenticateRequest(request: Request) {
    const authorization = request.headers.get('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      throw new HttpError(401, 'Missing bearer token');
    }

    const token = authorization.slice('Bearer '.length).trim();
    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new HttpError(401, 'Invalid authentication token');
    }

    return toSafeUser(user);
  },
};
