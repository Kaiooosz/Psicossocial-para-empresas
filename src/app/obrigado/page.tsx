import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  MessageCircle,
  AtSign,
  ArrowRight,
  Clock,
  FileCheck2,
  Users,
} from "lucide-react";
import { BackgroundMotion, FadeIn } from "./ObrigadoMotion";

const WHATSAPP = "https://wa.me/5521979901686";
const INSTAGRAM = "https://www.instagram.com/bezerraeborges";

const PROXIMOS = [
  {
    icon: Clock,
    titulo: "Análise em andamento",
    desc: "Nossa equipe já está processando suas respostas e cruzando os dados dos quatro pilares.",
  },
  {
    icon: Users,
    titulo: "Contato do escritório",
    desc: "Em breve, um especialista do Bezerra Borges Advogados entrará em contato com o panorama da sua empresa.",
  },
  {
    icon: FileCheck2,
    titulo: "Diagnóstico e plano de ação",
    desc: "Você receberá o diagnóstico completo com índice de risco por pilar e as recomendações de intervenção.",
  },
];

export default function ObrigadoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero com foto em motion */}
      <section className="relative flex flex-1 items-center justify-center overflow-hidden">
        <BackgroundMotion />

        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(156,122,67,0.15),transparent_70%)]" />

        <div className="relative z-10 mx-auto max-w-2xl px-6 py-20 text-center text-white">
          <FadeIn delay={0.1}>
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={1.5} />
            </span>
          </FadeIn>

          <FadeIn delay={0.25}>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight sm:text-5xl">
              Respostas enviadas com sucesso
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/80">
              Obrigado pela sua participação. Suas respostas foram registradas e
              contribuem para o diagnóstico de saúde organizacional da sua empresa.
            </p>
          </FadeIn>

          <FadeIn delay={0.55}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="sheen relative inline-flex items-center gap-2 overflow-hidden rounded-sm bg-white px-6 py-3 text-sm font-medium text-ink shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-white/25 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/50"
              >
                <AtSign className="h-4 w-4" /> Seguir no Instagram
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Próximos passos */}
      <section className="border-t border-border bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-accent">
            O que acontece agora
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight text-ink">
            Próximos passos
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PROXIMOS.map((p, i) => (
              <div
                key={p.titulo}
                className="rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-ink/5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <p.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </span>
                <p className="mt-1 text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-base font-semibold text-ink">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink transition hover:text-accent"
            >
              Voltar para o início <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
          <Image
            src="/bblaw-preto.svg"
            alt="Bezerra Borges Advogados"
            width={505}
            height={239}
            unoptimized
            className="h-6 w-auto opacity-50"
          />
          <p className="text-xs text-muted">bezerraborges.com.br</p>
        </div>
      </footer>
    </div>
  );
}
