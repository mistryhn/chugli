import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { users } from '@/db/schema/user.schema';

type CreateUserRecord = {
  name: string;
  email: string;
  password: string;
};

export const userRepository = {
  async findAll() {
    return db.select().from(users);
  },

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  },

  async findById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },

  async create(payload: CreateUserRecord) {
    const result = await db.insert(users).values(payload).returning();
    return result[0];
  },
};
