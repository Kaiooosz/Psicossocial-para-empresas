import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Inicializacao preguicosa: o PrismaClient so e construido na primeira query.
// Evita que o build (coleta de page data) ou paginas estaticas quebrem quando
// DATABASE_URL ainda nao esta presente no ambiente.
function criarPrisma(): PrismaClient {
  return (
    globalForPrisma.prisma ??
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    })
  );
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = (globalForPrisma.prisma ??= criarPrisma());
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma ??= criarPrisma();
}
