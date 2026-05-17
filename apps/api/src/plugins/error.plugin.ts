import { Elysia } from 'elysia';

export const errorPlugin = new Elysia().onError(({ code, error, set }) => {
  switch (code) {
    case 'VALIDATION':
      set.status = 400;

      return {
        success: false,
        message: 'Validation failed',
        error: error.message,
      };

    default:
      set.status = 500;

      return {
        success: false,
        message: error?.message || 'Internal server error',
      };
  }
});
