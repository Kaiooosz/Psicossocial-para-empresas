import { prisma } from "./prisma";
import {
  indicePilar,
  nivelRisco,
  sinalizaRisco,
  type Pilar,
  type TipoRespondente,
  type ValorResposta,
} from "./scoring";

const PILARES: Pilar[] = ["CULTURA", "ORGANIZACAO", "METAS", "LIDERANCA"];
const PUBLICOS: TipoRespondente[] = ["COLABORADOR", "LIDER"];

export type IndicePilarPublico = {
  pilar: Pilar;
  publico: TipoRespondente;
  indice: number | null;
  nivel: ReturnType<typeof nivelRisco>;
  respondentes: number;
};

export type RiscoPergunta = {
  perguntaId: number;
  ordem: number;
  pilar: Pilar;
  publico: TipoRespondente;
  texto: string;
  totalRespostas: number;
  sinalizaram: number;
  percentual: number;
};

export type RelatorioEmpresa = {
  empresa: { id: string; nome: string; status: string; inicioEm: Date };
  taxa: {
    publico: TipoRespondente;
    enviados: number;
    responderam: number;
    percentual: number;
  }[];
  indices: IndicePilarPublico[];
  perguntas: RiscoPergunta[];
};

export async function relatorioEmpresa(
  empresaId: string
): Promise<RelatorioEmpresa | null> {
  const empresa = await prisma.empresa.findUnique({
    where: { id: empresaId },
    include: {
      respondentes: {
        include: {
          respostas: { include: { pergunta: true } },
        },
      },
    },
  });
  if (!empresa) return null;

  // Taxa de resposta por publico.
  const taxa = PUBLICOS.map((publico) => {
    const grupo = empresa.respondentes.filter((r) => r.tipo === publico);
    const responderam = grupo.filter((r) => r.respondeu).length;
    return {
      publico,
      enviados: grupo.length,
      responderam,
      percentual: grupo.length ? (responderam / grupo.length) * 100 : 0,
    };
  });

  // Indice por pilar e publico = media da soma das pontuacoes de cada respondente.
  const indices: IndicePilarPublico[] = [];
  for (const publico of PUBLICOS) {
    const respondentes = empresa.respondentes.filter(
      (r) => r.tipo === publico && r.respondeu
    );
    for (const pilar of PILARES) {
      const somas = respondentes.map((r) =>
        r.respostas
          .filter((resp) => resp.pergunta.pilar === pilar)
          .reduce((acc, resp) => acc + resp.pontuacao, 0)
      );
      const indice = indicePilar(somas);
      indices.push({
        pilar,
        publico,
        indice,
        nivel: nivelRisco(indice),
        respondentes: respondentes.length,
      });
    }
  }

  // % de risco por pergunta.
  const mapa = new Map<number, RiscoPergunta>();
  for (const r of empresa.respondentes) {
    if (!r.respondeu) continue;
    for (const resp of r.respostas) {
      let item = mapa.get(resp.perguntaId);
      if (!item) {
        item = {
          perguntaId: resp.perguntaId,
          ordem: resp.pergunta.ordem,
          pilar: resp.pergunta.pilar as Pilar,
          publico: resp.pergunta.publico as TipoRespondente,
          texto: resp.pergunta.texto,
          totalRespostas: 0,
          sinalizaram: 0,
          percentual: 0,
        };
        mapa.set(resp.perguntaId, item);
      }
      item.totalRespostas += 1;
      if (sinalizaRisco(resp.valor as ValorResposta)) item.sinalizaram += 1;
    }
  }
  const perguntas = [...mapa.values()].map((p) => ({
    ...p,
    percentual: p.totalRespostas
      ? (p.sinalizaram / p.totalRespostas) * 100
      : 0,
  }));

  return {
    empresa: {
      id: empresa.id,
      nome: empresa.nome,
      status: empresa.status,
      inicioEm: empresa.inicioEm,
    },
    taxa,
    indices,
    perguntas,
  };
}
