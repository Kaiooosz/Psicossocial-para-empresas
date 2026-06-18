import { PrismaClient } from "@prisma/client";
import { PONTUACAO } from "../src/lib/scoring";
import { relatorioEmpresa } from "../src/lib/metrics";

const prisma = new PrismaClient();

async function main() {
  // Empresa de teste isolada
  const empresa = await prisma.empresa.create({
    data: { nome: "ACME Teste (verificação)" },
  });

  // 3 colaboradores + 2 lideres
  const colaboradores = await Promise.all(
    [0, 1, 2].map((i) =>
      prisma.respondente.create({
        data: { empresaId: empresa.id, tipo: "COLABORADOR", token: `t-colab-${empresa.id}-${i}` },
      })
    )
  );
  const lideres = await Promise.all(
    [0, 1].map((i) =>
      prisma.respondente.create({
        data: { empresaId: empresa.id, tipo: "LIDER", token: `t-lider-${empresa.id}-${i}` },
      })
    )
  );

  const perguntasColab = await prisma.pergunta.findMany({ where: { publico: "COLABORADOR" } });
  const perguntasLider = await prisma.pergunta.findMany({ where: { publico: "LIDER" } });

  // Colaboradores respondem TODAS como CONCORDO -> soma por pilar = 15 * 6.667 = 100.005
  for (const r of colaboradores) {
    await prisma.resposta.createMany({
      data: perguntasColab.map((p) => ({
        respondenteId: r.id,
        perguntaId: p.id,
        valor: "CONCORDO" as const,
        pontuacao: PONTUACAO.CONCORDO,
      })),
    });
    await prisma.respondente.update({ where: { id: r.id }, data: { respondeu: true, respondidoEm: new Date() } });
  }

  // Lideres respondem TODAS como DISCORDO_TOTAL -> soma por pilar = 0
  for (const r of lideres) {
    await prisma.resposta.createMany({
      data: perguntasLider.map((p) => ({
        respondenteId: r.id,
        perguntaId: p.id,
        valor: "DISCORDO_TOTAL" as const,
        pontuacao: PONTUACAO.DISCORDO_TOTAL,
      })),
    });
    await prisma.respondente.update({ where: { id: r.id }, data: { respondeu: true, respondidoEm: new Date() } });
  }

  const rel = await relatorioEmpresa(empresa.id);
  if (!rel) throw new Error("relatorio nulo");

  console.log("\n=== TAXA DE RESPOSTA ===");
  for (const t of rel.taxa) console.log(`${t.publico}: ${t.responderam}/${t.enviados} (${Math.round(t.percentual)}%)`);

  console.log("\n=== INDICE POR PILAR ===");
  for (const i of rel.indices) {
    console.log(`${i.pilar.padEnd(12)} ${i.publico.padEnd(11)} -> ${i.indice?.toFixed(2)} (${i.nivel})`);
  }

  const colabCultura = rel.indices.find((i) => i.pilar === "CULTURA" && i.publico === "COLABORADOR")!;
  const liderCultura = rel.indices.find((i) => i.pilar === "CULTURA" && i.publico === "LIDER")!;
  const perg1 = rel.perguntas.find((p) => p.pilar === "CULTURA" && p.publico === "COLABORADOR" && p.ordem === 1)!;

  console.log("\n=== VERIFICACOES ===");
  console.log(`Colab CULTURA ~100 e GRAVISSIMO: ${Math.round(colabCultura.indice!)} / ${colabCultura.nivel} -> ${Math.round(colabCultura.indice!) === 100 && colabCultura.nivel === "GRAVISSIMO" ? "OK" : "FALHOU"}`);
  console.log(`Lider CULTURA = 0 e BAIXO: ${liderCultura.indice} / ${liderCultura.nivel} -> ${liderCultura.indice === 0 && liderCultura.nivel === "BAIXO" ? "OK" : "FALHOU"}`);
  console.log(`% risco pergunta 1 colab = 100%: ${Math.round(perg1.percentual)}% -> ${Math.round(perg1.percentual) === 100 ? "OK" : "FALHOU"}`);

  // limpeza
  await prisma.empresa.delete({ where: { id: empresa.id } });
  console.log("\nEmpresa de teste removida.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
