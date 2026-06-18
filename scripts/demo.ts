import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const e = await prisma.empresa.findFirst({ where: { nome: "Empresa Demo" } });
  const empresa = e ?? (await prisma.empresa.create({ data: { nome: "Empresa Demo" } }));
  let colab = await prisma.respondente.findFirst({
    where: { empresaId: empresa.id, tipo: "COLABORADOR", token: "demo-colab-001" },
  });
  if (!colab)
    colab = await prisma.respondente.create({
      data: { empresaId: empresa.id, tipo: "COLABORADOR", token: "demo-colab-001" },
    });
  let lider = await prisma.respondente.findFirst({
    where: { empresaId: empresa.id, tipo: "LIDER", token: "demo-lider-001" },
  });
  if (!lider)
    lider = await prisma.respondente.create({
      data: { empresaId: empresa.id, tipo: "LIDER", token: "demo-lider-001" },
    });
  console.log("empresaId=" + empresa.id);
  console.log("tokenColab=" + colab.token + " respondeu=" + colab.respondeu);
  console.log("tokenLider=" + lider.token + " respondeu=" + lider.respondeu);
}
main().then(() => prisma.$disconnect());
