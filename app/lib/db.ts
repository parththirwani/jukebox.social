// app/lib/db.ts
import { PrismaClient } from "../generated/prisma"; 

const globalForPrisma = globalThis as unknown as {
  prismaClient: PrismaClient | undefined;
};

export const prismaClient =
  globalForPrisma.prismaClient ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaClient = prismaClient;
}
