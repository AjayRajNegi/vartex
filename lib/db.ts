import { PrismaClient } from "./generated/prisma";
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

// For long lived servers
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// For serverless production
globalForPrisma.prisma = prisma;
