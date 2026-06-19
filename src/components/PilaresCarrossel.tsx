"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PILARES = [
  {
    n: "01",
    nome: "Cultura Organizacional",
    desc: "Segurança psicológica, pertencimento, respeito, liberdade de expressão e a liderança como exemplo cultural.",
    img: "/pilar-cultura.jpg",
  },
  {
    n: "02",
    nome: "Organização do Trabalho",
    desc: "Sobrecarga, clareza de papéis, acúmulo de funções, equilíbrio vida-trabalho e disponibilidade de recursos.",
    img: "/pilar-organizacao.jpg",
  },
  {
    n: "03",
    nome: "Metas e Performance",
    desc: "Atingibilidade das metas, clareza dos critérios, percepção de justiça nas cobranças e autonomia para executar.",
    img: "/pilar-metas.jpg",
  },
  {
    n: "04",
    nome: "Liderança e Gestão de Pessoas",
    desc: "Confiança na liderança, qualidade do feedback, apoio recebido, preparo do líder e reconhecimento.",
    img: "/pilar-lideranca.jpg",
  },
];

export default function PilaresCarrossel() {
  const ref = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);

  function irPara(i: number) {
    const el = ref.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(PILARES.length - 1, i));
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
      setAtivo(idx);
    }
  }

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / (el.scrollWidth / PILARES.length));
    setAtivo(Math.max(0, Math.min(PILARES.length - 1, i)));
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
            Quatro pilares de análise
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink">
            Onde o risco realmente se esconde
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            aria-label="Anterior"
            onClick={() => irPara(ativo - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Próximo"
            onClick={() => irPara(ativo + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        onScroll={onScroll}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PILARES.map((p) => (
          <article
            key={p.n}
            className="group relative h-[440px] w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl shadow-lg shadow-ink/10 ring-1 ring-ink/5 sm:w-[380px]"
          >
            <div
              className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${p.img})` }}
            />
            {/* Degradê suave em várias paradas */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--ink)_2%,rgba(22,38,63,0.85)_22%,rgba(22,38,63,0.45)_48%,rgba(22,38,63,0.12)_78%,transparent_100%)]" />
            {/* Brilho dourado sutil no hover */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative flex h-full flex-col justify-end p-7 text-white">
              <span className="text-sm font-semibold text-gold-grad">{p.n}</span>
              <h3 className="mt-2 text-2xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-1">
                {p.nome}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">{p.desc}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        {PILARES.map((p, i) => (
          <button
            key={p.n}
            aria-label={`Ir para ${p.nome}`}
            onClick={() => irPara(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === ativo ? "w-8 bg-accent" : "w-4 bg-ink/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
