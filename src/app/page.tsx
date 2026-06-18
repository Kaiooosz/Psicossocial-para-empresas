import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  ClipboardList,
  Users,
  Target,
  Building2,
  FileCheck2,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const PILARES = [
  {
    icon: Users,
    nome: "Cultura Organizacional",
    desc: "Segurança psicológica, pertencimento, respeito, liberdade de expressão e a liderança como exemplo cultural.",
  },
  {
    icon: ClipboardList,
    nome: "Organização do Trabalho",
    desc: "Sobrecarga, clareza de papéis, acúmulo de funções, equilíbrio vida-trabalho e disponibilidade de recursos.",
  },
  {
    icon: Target,
    nome: "Metas e Performance",
    desc: "Atingibilidade das metas, clareza dos critérios, percepção de justiça nas cobranças e autonomia para executar.",
  },
  {
    icon: Building2,
    nome: "Liderança e Gestão de Pessoas",
    desc: "Confiança na liderança, qualidade do feedback, apoio recebido, preparo do líder e reconhecimento.",
  },
];

const ETAPAS = [
  {
    n: "01",
    titulo: "Entrevista com o CEO",
    desc: "Mapeamento da visão estratégica, valores declarados e crenças que moldam a cultura — contexto qualitativo para interpretar os dados.",
  },
  {
    n: "02",
    titulo: "Aplicação dos Questionários",
    desc: "Dois questionários anônimos, um para líderes e um para colaboradores, com 60 perguntas cada estruturadas nos quatro pilares.",
  },
  {
    n: "03",
    titulo: "Entrevistas com a Psicóloga",
    desc: "Escuta coletiva ou individual conforme o porte da empresa, capturando narrativas que os dados quantitativos não revelam.",
  },
  {
    n: "04",
    titulo: "Diagnóstico, Plano e Laudo",
    desc: "Índice de risco por pilar, plano de ação priorizado e laudo final assinado por advogado e psicóloga com registro profissional.",
  },
];

const NIVEIS = [
  { faixa: "Acima de 90", nivel: "Gravíssimo", cor: "#b91c1c", bg: "#fee2e2" },
  { faixa: "70 a 90", nivel: "Grave", cor: "#c2410c", bg: "#ffedd5" },
  { faixa: "50 a 70", nivel: "Médio", cor: "#a16207", bg: "#fef9c3" },
  { faixa: "Abaixo de 50", nivel: "Baixo", cor: "#15803d", bg: "#dcfce7" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-brand">
                Risco Psicossocial
              </p>
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Conformidade NR-1
              </p>
            </div>
          </div>
          <Link
            href="#contato"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Solicitar análise
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-white to-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-brand-2">
              <Scale className="h-3.5 w-3.5" />
              NR-1 atualizada em 2024 · obrigação legal
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              Mapeamento de risco psicossocial que protege sua empresa
              juridicamente.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Diagnóstico quantitativo e qualitativo dos quatro pilares da saúde
              organizacional, plano de ação sugerido e laudo final assinado por
              advogado e psicóloga — a evidência documentada que a NR-1 exige.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#contato"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Solicitar análise <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#metodologia"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-background"
              >
                Como funciona
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Por que isso é urgente
            </div>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {[
                "A NR-1 passou a incluir riscos psicossociais como obrigação de gerenciamento (GRO).",
                "Empresas sem mapeamento estão sujeitas a autuações, multas e ações trabalhistas.",
                "Assédio moral, burnout e adoecimento psíquico geram passivo trabalhista crescente.",
                "O laudo assinado reduz significativamente a exposição em processos.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-2" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-2">
          Quatro pilares de análise
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">
          Onde o risco realmente se esconde
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PILARES.map((p) => (
            <div
              key={p.nome}
              className="rounded-xl border border-border bg-card p-6 transition hover:shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{p.nome}</h3>
              <p className="mt-2 text-sm text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="metodologia" className="border-y border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-2">
            Metodologia
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">
            Da escuta ao laudo, em quatro etapas
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ETAPAS.map((e) => (
              <div key={e.n} className="relative">
                <span className="text-4xl font-bold text-accent/40">{e.n}</span>
                <h3 className="mt-1 text-base font-semibold">{e.titulo}</h3>
                <p className="mt-2 text-sm text-muted">{e.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border bg-background p-8">
            <h3 className="text-lg font-semibold">Níveis de risco</h3>
            <p className="mt-1 text-sm text-muted">
              Cada pilar recebe um índice de 0 a 100. Quanto maior, maior o
              risco identificado.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {NIVEIS.map((n) => (
                <div
                  key={n.nivel}
                  className="rounded-lg border border-border p-4"
                  style={{ background: n.bg }}
                >
                  <p className="text-sm font-bold" style={{ color: n.cor }}>
                    {n.nivel}
                  </p>
                  <p className="mt-1 text-xs text-foreground/70">
                    Índice {n.faixa}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-2">
          Entregáveis
        </p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight">
          O que sua empresa recebe
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ClipboardList,
              t: "Diagnóstico quantitativo",
              d: "Índice por pilar e público, classificação de risco e percentual de sinalização por pergunta.",
            },
            {
              icon: Users,
              t: "Diagnóstico qualitativo",
              d: "Narrativas recorrentes e alinhamento entre a visão do CEO e a realidade percebida.",
            },
            {
              icon: Target,
              t: "Plano de ação sugerido",
              d: "Para cada pilar de risco: ação recomendada, prioridade, prazo e indicador de acompanhamento.",
            },
            {
              icon: FileCheck2,
              t: "Laudo final assinado",
              d: "Enquadramento legal na NR-1 e declaração de conformidade, assinada por advogado e psicóloga.",
            },
          ].map((e) => (
            <div key={e.t} className="rounded-xl border border-border bg-card p-6">
              <e.icon className="h-6 w-6 text-brand-2" />
              <h3 className="mt-3 text-base font-semibold">{e.t}</h3>
              <p className="mt-2 text-sm text-muted">{e.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contato" className="border-t border-border bg-brand">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">
            Coloque sua empresa em conformidade com a NR-1
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Solicite uma conversa para entender o porte da sua operação e montar
            o cronograma de aplicação dos questionários.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="mailto:contato@riscopsicossocial.com.br?subject=Solicitação de análise de risco psicossocial"
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-white/90"
            >
              Falar com a equipe <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Metodologia e Propriedade Intelectual de Anna Clara Silva Freitas.
          </p>
          <p>Confidencial · Reprodução proibida sem autorização.</p>
        </div>
      </footer>
    </div>
  );
}
