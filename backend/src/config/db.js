import { PrismaClient } from '@prisma/client';

let prisma = null;

try {
  prisma = new PrismaClient();
} catch (err) {
  console.warn('[Prisma] Could not initialize PrismaClient:', err.message);
}

export { prisma };
export default prisma;
