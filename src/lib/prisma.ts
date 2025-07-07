// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// O Prisma recomenda esta abordagem para evitar criar múltiplas conexões
// em ambientes de desenvolvimento com hot-reloading.

declare global {
  // permite que a variável global `prisma` seja usada no escopo global do NodeJS
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Opcional: mostra as queries SQL no console
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
export { PrismaClient };

