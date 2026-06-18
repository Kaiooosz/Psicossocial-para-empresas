import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const NOVA = process.argv[2] ?? "Bitcoin2026";

async function main() {
  const hash = await bcrypt.hash(NOVA, 10);
  const r = await prisma.adminUser.updateMany({ data: { senhaHash: hash } });
  console.log(`Senha atualizada para ${r.count} admin(s).`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
