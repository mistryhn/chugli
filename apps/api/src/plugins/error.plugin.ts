import { Elysia } from 'elysia';
import { HttpError } from '@/lib/http-error';

export const errorPlugin = new Elysia().onError(({ code, error, set }) => {
  if (error instanceof HttpError) {
    set.status = error.status;

    return {
      success: false,
      message: error.message,
    };
  }

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
