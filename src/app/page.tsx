import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  ClipboardList,
  Users,
  Target,
  FileCheck2,
  ArrowRight,
  MessageCircle,
  Mail,
  AtSign,
  MapPin,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import PilaresCarrossel from "@/components/PilaresCarrossel";
import EtapasEscada from "@/components/EtapasEscada";
import NiveisRisco from "@/components/NiveisRisco";
import Faq from "@/components/Faq";

const WHATSAPP = "https://wa.me/5521979901686";
const EMAIL = "contato@bezerraborges.com.br";
const INSTAGRAM = "https://www.instagram.com/bezerraeborges";
const SITE = "https://www.bezerraborges.com.br";

const CASOS = [
  {
    contexto: "Indústria · ~200 funcionários",
    dor: "Rotatividade alta e afastamentos por estresse, com receio de ações por assédio moral.",
    desfecho:
      "A análise apontou nível Grave em Liderança e Metas e um déficit de percepção da diretoria. A empresa recebeu plano de ação priorizado e laudo de conformidade com a NR-1.",
  },
  {
    contexto: "Rede varejista · dezenas de lojas",
    dor: "Metas agressivas e lideranças despreparadas gerando clima tenso e queda de produtividade.",
    desfecho:
      "Colaboradores e líderes confirmaram sobrecarga estrutural. O encaminhamento foi revisão do processo de metas, capacitação de líderes e evidência documentada para o GRO.",
  },
  {
    contexto: "Empresa de tecnologia · ~50 pessoas",
    dor: "Crescimento rápido, sinais de burnout e nenhum processo formal de gestão de risco psicossocial.",
    desfecho:
      "Cultura e Organização em nível Médio, com risco crescente. Recomendou-se canal de escuta e monitoramento periódico, demonstrando conformidade antes da autuação.",
  },
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
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
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
          <Reveal>
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
          </Reveal>

          <Reveal dir="right" delay={0.1}>
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
                  <li
                    key={t}
                    className="flex gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PILARES — carrossel */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <PilaresCarrossel />
      </section>

      {/* METODOLOGIA — escada + níveis */}
      <section id="metodologia" className="border-y border-border bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Metodologia
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
              Da escuta ao laudo, em quatro etapas
            </h2>
          </Reveal>
          <EtapasEscada />
          <NiveisRisco />
        </div>
      </section>

      {/* ENTREGÁVEIS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Entregáveis
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
            O que sua empresa recebe
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ClipboardList, t: "Diagnóstico quantitativo", d: "Índice por pilar e público, classificação de risco e percentual de sinalização por pergunta." },
            { icon: Users, t: "Diagnóstico qualitativo", d: "Narrativas recorrentes e alinhamento entre a visão do CEO e a realidade percebida." },
            { icon: Target, t: "Plano de ação sugerido", d: "Para cada pilar de risco: ação recomendada, prioridade, prazo e indicador de acompanhamento." },
            { icon: FileCheck2, t: "Laudo final assinado", d: "Enquadramento legal na NR-1 e declaração de conformidade, assinada por advogado e psicóloga." },
          ].map((e, i) => (
            <Reveal key={e.t} delay={i * 0.06} className="bg-card p-7">
              <e.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-medium text-ink">{e.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{e.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CASOS — cenários ilustrativos */}
      <section className="border-y border-border bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Cenários ilustrativos
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
              Dores comuns — e o que a análise revela
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {CASOS.map((c, i) => (
              <Reveal key={c.contexto} delay={i * 0.08}>
                <div className="flex h-full flex-col border border-border bg-card p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                    {c.contexto}
                  </p>
                  <p className="mt-4 text-sm font-medium text-ink">{c.dor}</p>
                  <div className="mt-4 border-t border-border pt-4">
                    <p className="text-sm leading-relaxed text-muted">{c.desfecho}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">
            Exemplos ilustrativos para fins educativos. Não representam clientes
            específicos nem promessa de resultado.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Dúvidas frequentes
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            O que as empresas mais perguntam
          </h2>
        </Reveal>
        <Faq />
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
                <Link
                  href="/questionario"
                  className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:border-white/50"
                >
                  Responder agora <ArrowRight className="h-4 w-4" />
                </Link>
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

      <footer className="border-t border-white/10 bg-ink">
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
