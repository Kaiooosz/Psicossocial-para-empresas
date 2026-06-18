"use client";

import { motion } from "framer-motion";

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

export default function EtapasEscada() {
  return (
    <div className="mt-12 flex flex-col gap-5">
      {ETAPAS.map((e, i) => (
        <motion.div
          key={e.n}
          initial={{ opacity: 0, x: i % 2 === 0 ? -70 : 70 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl rounded-2xl border border-border bg-card p-7 shadow-[0_1px_0_rgba(22,38,63,0.04)] lg:w-[58%]"
          style={{ marginLeft: `${i * 14}%` }}
        >
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-accent">{e.n}</span>
            <h3 className="text-lg font-semibold text-ink">{e.titulo}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{e.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
