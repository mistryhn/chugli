import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
