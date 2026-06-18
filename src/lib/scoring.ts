export type ValorResposta =
  | "CONCORDO"
  | "CONCORDO_PARCIAL"
  | "NEUTRO"
  | "DISCORDO_PARCIAL"
  | "DISCORDO_TOTAL";

export type Pilar = "CULTURA" | "ORGANIZACAO" | "METAS" | "LIDERANCA";
export type TipoRespondente = "COLABORADOR" | "LIDER";

// Pontuacao por resposta. Cada pilar tem 15 perguntas e maximo 100 pontos.
// Concordo = 100/15 = 6.667 | Parciais = 6.667/2 = 3.333 | Neutro/Discordo Total = 0
export const PONTUACAO: Record<ValorResposta, number> = {
  CONCORDO: 6.667,
  CONCORDO_PARCIAL: 3.333,
  NEUTRO: 0,
  DISCORDO_PARCIAL: 3.333,
  DISCORDO_TOTAL: 0,
};

export const OPCOES: { valor: ValorResposta; label: string }[] = [
  { valor: "CONCORDO", label: "Concordo" },
  { valor: "CONCORDO_PARCIAL", label: "Concordo Parcialmente" },
  { valor: "NEUTRO", label: "Neutro" },
  { valor: "DISCORDO_PARCIAL", label: "Discordo Parcialmente" },
  { valor: "DISCORDO_TOTAL", label: "Discordo Totalmente" },
];

export const PILARES: { id: Pilar; nome: string }[] = [
  { id: "CULTURA", nome: "Cultura Organizacional" },
  { id: "ORGANIZACAO", nome: "Organização do Trabalho" },
  { id: "METAS", nome: "Metas e Performance" },
  { id: "LIDERANCA", nome: "Liderança e Gestão de Pessoas" },
];

export const NOME_PILAR: Record<Pilar, string> = {
  CULTURA: "Cultura Organizacional",
  ORGANIZACAO: "Organização do Trabalho",
  METAS: "Metas e Performance",
  LIDERANCA: "Liderança e Gestão de Pessoas",
};

export type NivelRisco = "GRAVISSIMO" | "GRAVE" | "MEDIO" | "BAIXO" | "SEM_DADOS";

export function nivelRisco(indice: number | null): NivelRisco {
  if (indice === null) return "SEM_DADOS";
  if (indice > 90) return "GRAVISSIMO";
  if (indice >= 70) return "GRAVE";
  if (indice >= 50) return "MEDIO";
  return "BAIXO";
}

export const NIVEL_META: Record<
  NivelRisco,
  { label: string; cor: string; bg: string; descricao: string }
> = {
  GRAVISSIMO: {
    label: "Gravíssimo",
    cor: "#b91c1c",
    bg: "#fee2e2",
    descricao:
      "Intervenção imediata. Risco jurídico ativo. Alta probabilidade de passivo trabalhista.",
  },
  GRAVE: {
    label: "Grave",
    cor: "#c2410c",
    bg: "#ffedd5",
    descricao:
      "Intervenção urgente. Risco jurídico presente, mas ainda há margem para reversão.",
  },
  MEDIO: {
    label: "Médio",
    cor: "#a16207",
    bg: "#fef9c3",
    descricao:
      "Colaboradores insatisfeitos identificados. Ação preventiva pode corrigir os fatores de risco.",
  },
  BAIXO: {
    label: "Baixo",
    cor: "#15803d",
    bg: "#dcfce7",
    descricao: "Poucos sinais de risco. Recomenda-se monitoramento periódico.",
  },
  SEM_DADOS: {
    label: "Sem dados",
    cor: "#475569",
    bg: "#f1f5f9",
    descricao: "Ainda não há respostas suficientes para calcular o índice.",
  },
};

// Indice do pilar = soma das pontuacoes de todos os respondentes / numero de respondentes.
// Cada respondente contribui com a soma das suas 15 respostas do pilar (0 a 100).
export function indicePilar(
  somasPorRespondente: number[]
): number | null {
  if (somasPorRespondente.length === 0) return null;
  const total = somasPorRespondente.reduce((a, b) => a + b, 0);
  return total / somasPorRespondente.length;
}

// Sinaliza risco quando concorda total ou parcialmente.
export function sinalizaRisco(valor: ValorResposta): boolean {
  return valor === "CONCORDO" || valor === "CONCORDO_PARCIAL";
}

// Cruzamento entre publicos (dossie, secao 6): compara percepcao de
// colaboradores e lideres no mesmo pilar e gera a leitura.
export type Cruzamento = {
  tom: "critico" | "estrutural" | "lideranca" | "baixo" | "parcial";
  texto: string;
};

export function interpretarCruzamento(
  colab: number | null,
  lider: number | null
): Cruzamento {
  if (colab === null || lider === null) {
    return {
      tom: "parcial",
      texto:
        "Dados insuficientes em um dos públicos para comparar a percepção.",
    };
  }
  const diff = colab - lider;
  if (colab < 50 && lider < 50) {
    return {
      tom: "baixo",
      texto: "Baixo risco percebido por ambos os públicos.",
    };
  }
  if (diff >= 20) {
    return {
      tom: "critico",
      texto:
        "Déficit de percepção: colaboradores sinalizam risco bem maior do que a liderança percebe.",
    };
  }
  if (diff <= -20) {
    return {
      tom: "lideranca",
      texto:
        "Liderança mais exposta: líderes percebem mais risco do que os colaboradores.",
    };
  }
  return {
    tom: "estrutural",
    texto:
      "Percepção convergente — indica problema estrutural, não apenas de percepção.",
  };
}
