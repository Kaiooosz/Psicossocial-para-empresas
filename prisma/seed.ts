import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PERGUNTAS } from "../src/lib/perguntas";

const prisma = new PrismaClient();

async function main() {
  for (const p of PERGUNTAS) {
    await prisma.pergunta.upsert({
      where: {
        pilar_publico_ordem: {
          pilar: p.pilar,
          publico: p.publico,
          ordem: p.ordem,
        },
      },
      update: { texto: p.texto },
      create: p,
    });
  }
  console.log(`Perguntas sincronizadas: ${PERGUNTAS.length}`);

  const email = process.env.ADMIN_EMAIL ?? "admin@riscopsicossocial.com.br";
  const senha = process.env.ADMIN_SENHA ?? "anna2026";
  const senhaHash = await bcrypt.hash(senha, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, senhaHash, nome: "Anna Clara" },
  });
  console.log(`Admin garantido: ${email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
