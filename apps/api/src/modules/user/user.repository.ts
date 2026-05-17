import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '@/db/schema/user.schema';
import type { CreateUserInput } from './user.schema';

export const userRepository = {
  async findAll() {
    return db.select().from(users);
  },

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  },

  async create(payload: CreateUserInput) {
    const result = await db.insert(users).values(payload).returning();
    return result[0];
  },
};
