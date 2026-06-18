import { PrismaClient } from "@prisma/client";
import { PONTUACAO, type ValorResposta } from "../src/lib/scoring";

const prisma = new PrismaClient();

// Replica a logica de submeterQuestionario (src/lib/actions.ts) para verificacao via DB.
async function submeter(token: string, respostas: Record<number, ValorResposta>) {
  const respondente = await prisma.respondente.findUnique({ where: { token } });
  if (!respondente) return { ok: false, erro: "Link inválido." };
  if (respondente.respondeu) return { ok: false, erro: "Questionário já respondido." };
  const perguntas = await prisma.pergunta.findMany({ where: { publico: respondente.tipo }, select: { id: true } });
  for (const p of perguntas) if (!respostas[p.id]) return { ok: false, erro: "Responda todas as perguntas antes de enviar." };
  await prisma.$transaction([
    prisma.resposta.createMany({
      data: perguntas.map((p) => ({ respondenteId: respondente.id, perguntaId: p.id, valor: respostas[p.id], pontuacao: PONTUACAO[respostas[p.id]] })),
    }),
    prisma.respondente.update({ where: { id: respondente.id }, data: { respondeu: true, respondidoEm: new Date() } }),
  ]);
  return { ok: true };
}

async function main() {
  const token = "demo-colab-001";
  const perguntas = await prisma.pergunta.findMany({ where: { publico: "COLABORADOR" } });

  console.log("incompleto:", JSON.stringify(await submeter(token, { [perguntas[0].id]: "CONCORDO" })));

  const respostas: Record<number, ValorResposta> = {};
  perguntas.forEach((p, i) => { respostas[p.id] = i % 2 === 0 ? "CONCORDO" : "DISCORDO_TOTAL"; });
  console.log("completo:", JSON.stringify(await submeter(token, respostas)));
  console.log("reenvio:", JSON.stringify(await submeter(token, respostas)));

  const r = await prisma.respondente.findUnique({ where: { token }, include: { _count: { select: { respostas: true } } } });
  console.log(`respondente respondeu=${r?.respondeu} respostas=${r?._count.respostas}`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
