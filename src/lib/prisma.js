import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    // Настройки connection pool для предотвращения "Too many connections"
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown - закрываем соединения при завершении процесса
if (process.env.NODE_ENV === "development") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

