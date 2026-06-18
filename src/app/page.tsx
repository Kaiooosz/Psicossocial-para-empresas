import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  ClipboardList,
  Users,
  Target,
  Building2,
  FileCheck2,
  ArrowRight,
  MessageCircle,
  Mail,
  AtSign,
  MapPin,
} from "lucide-react";

const WHATSAPP = "https://wa.me/5521979901686";
const EMAIL = "contato@bezerraborges.com.br";
const INSTAGRAM = "https://www.instagram.com/bezerraeborges";
const SITE = "https://www.bezerraborges.com.br";

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
  { nivel: "Gravíssimo", faixa: "Acima de 90", desc: "Intervenção imediata. Risco jurídico ativo." },
  { nivel: "Grave", faixa: "70 a 90", desc: "Intervenção urgente, com margem para reversão." },
  { nivel: "Médio", faixa: "50 a 70", desc: "Ação preventiva pode corrigir os fatores de risco." },
  { nivel: "Baixo", faixa: "Abaixo de 50", desc: "Poucos sinais de risco. Monitoramento periódico." },
];

function Marca({ branco = false }: { branco?: boolean }) {
  return (
    <Image
      src={branco ? "/bblaw-branco.svg" : "/bblaw-preto.svg"}
      alt="Bezerra Borges Advogados"
      width={505}
      height={239}
      priority
      unoptimized
      className="h-8 w-auto"
    />
  );
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Marca />
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span className="hidden text-xs uppercase tracking-[0.18em] text-muted sm:block">
              Risco Psicossocial · NR-1
            </span>
          </div>
          <Link
            href="/questionario"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Ir para as perguntas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
              <Scale className="h-3.5 w-3.5" />
              NR-1 atualizada em 2024 · obrigação legal
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
              Mapeamento de risco psicossocial que protege sua empresa
              juridicamente.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Diagnóstico quantitativo e qualitativo dos quatro pilares da saúde
              organizacional, plano de ação sugerido e laudo final assinado por
              advogado e psicóloga — a evidência documentada que a NR-1 exige.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/questionario"
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Ir para as perguntas <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#contato"
                className="inline-flex items-center gap-2 rounded-sm border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition hover:border-ink/40"
              >
                Falar com o escritório
              </Link>
            </div>
          </div>

          <div className="border border-border bg-card p-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Por que isso é urgente
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-ink-soft">
              {[
                "A NR-1 passou a incluir riscos psicossociais como obrigação de gerenciamento (GRO).",
                "Empresas sem mapeamento estão sujeitas a autuações, multas e ações trabalhistas.",
                "Assédio moral, burnout e adoecimento psíquico geram passivo trabalhista crescente.",
                "O laudo assinado reduz significativamente a exposição em processos.",
              ].map((t) => (
                <li key={t} className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PILARES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Quatro pilares de análise
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
          Onde o risco realmente se esconde
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
          {PILARES.map((p) => (
            <div key={p.nome} className="bg-card p-7">
              <p.icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-medium text-ink">{p.nome}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* METODOLOGIA */}
      <section id="metodologia" className="border-y border-border bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Metodologia
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
            Da escuta ao laudo, em quatro etapas
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ETAPAS.map((e) => (
              <div key={e.n} className="border-t border-ink pt-4">
                <span className="text-sm font-medium text-accent">{e.n}</span>
                <h3 className="mt-2 text-base font-medium text-ink">{e.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 border border-border bg-card">
            <div className="border-b border-border px-7 py-5">
              <h3 className="text-lg font-medium text-ink">Níveis de risco</h3>
              <p className="mt-1 text-sm text-muted">
                Cada pilar recebe um índice de 0 a 100. Quanto maior, maior o risco.
              </p>
            </div>
            <div className="divide-y divide-border">
              {NIVEIS.map((n) => (
                <div key={n.nivel} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-7 py-4">
                  <span className="w-28 text-sm font-medium text-ink">{n.nivel}</span>
                  <span className="w-28 text-sm tabular-nums text-muted">Índice {n.faixa}</span>
                  <span className="flex-1 text-sm text-muted">{n.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENTREGÁVEIS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
          Entregáveis
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
          O que sua empresa recebe
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ClipboardList, t: "Diagnóstico quantitativo", d: "Índice por pilar e público, classificação de risco e percentual de sinalização por pergunta." },
            { icon: Users, t: "Diagnóstico qualitativo", d: "Narrativas recorrentes e alinhamento entre a visão do CEO e a realidade percebida." },
            { icon: Target, t: "Plano de ação sugerido", d: "Para cada pilar de risco: ação recomendada, prioridade, prazo e indicador de acompanhamento." },
            { icon: FileCheck2, t: "Laudo final assinado", d: "Enquadramento legal na NR-1 e declaração de conformidade, assinada por advogado e psicóloga." },
          ].map((e) => (
            <div key={e.t} className="bg-card p-7">
              <e.icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-medium text-ink">{e.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{e.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="border-t border-border bg-ink text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <div>
              <Marca branco />
              <h2 className="mt-8 text-3xl font-semibold tracking-tight">
                Coloque sua empresa em conformidade com a NR-1
              </h2>
              <p className="mt-4 max-w-md text-white/70">
                Fale com o Bezerra Borges Advogados para mapear o porte da sua
                operação e montar o cronograma de aplicação dos questionários.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-white/90"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white/50"
                >
                  <Mail className="h-4 w-4" /> E-mail
                </a>
              </div>
            </div>

            <div className="space-y-5 border-t border-white/15 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-white/80 transition hover:text-white">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>+55 21 97990-1686</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-start gap-3 text-sm text-white/80 transition hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{EMAIL}</span>
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-sm text-white/80 transition hover:text-white">
                <AtSign className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>@bezerraeborges</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-white/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  Av. Paulista, 1636, Conj. 4, 15º andar — Cerqueira César
                  <br />
                  São Paulo — SP, CEP 01310-200
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Bezerra Borges Advogados ·{" "}
            <a href={SITE} target="_blank" rel="noopener noreferrer" className="hover:text-white/70">
              bezerraborges.com.br
            </a>
          </p>
          <p>Metodologia e IP de Anna Clara Silva Freitas · Uso restrito.</p>
        </div>
      </footer>
    </div>
  );
}
