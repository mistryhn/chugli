import type { LoginInput, RegisterInput } from './auth.schema';
import { authService } from './auth.service';

export const authController = {
  async register({
    body,
    set,
  }: {
    body: RegisterInput;
    set: { status?: number | string };
  }) {
    const data = await authService.register(body);
    set.status = 201;

    return {
      success: true,
      message: 'User registered successfully',
      data,
    };
  },

  async login({ body }: { body: LoginInput }) {
    const data = await authService.login(body);

    return {
      success: true,
      message: 'Logged in successfully',
      data,
    };
  },

  async me({ request }: { request: Request }) {
    const user = await authService.authenticateRequest(request);

    return {
      success: true,
      data: user,
    };
  },
};
