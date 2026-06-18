"use client";

import { motion } from "framer-motion";

const NIVEIS = [
  { nivel: "Gravíssimo", faixa: "Acima de 90", desc: "Intervenção imediata. Risco jurídico ativo." },
  { nivel: "Grave", faixa: "70 a 90", desc: "Intervenção urgente, com margem para reversão." },
  { nivel: "Médio", faixa: "50 a 70", desc: "Ação preventiva pode corrigir os fatores de risco." },
  { nivel: "Baixo", faixa: "Abaixo de 50", desc: "Poucos sinais de risco. Monitoramento periódico." },
];

export default function NiveisRisco() {
  return (
    <div className="mt-16 border-t border-ink/15 pt-10">
      <h3 className="text-lg font-semibold text-ink">Níveis de risco</h3>
      <p className="mt-1 text-sm text-muted">
        Cada pilar recebe um índice de 0 a 100. Quanto maior, maior o risco.
      </p>
      <div className="mt-6">
        {NIVEIS.map((n, i) => (
          <motion.div
            key={n.nivel}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-b border-border py-5 first:border-t"
          >
            <span className="w-32 text-base font-semibold text-ink">{n.nivel}</span>
            <span className="w-32 text-sm tabular-nums text-accent">Índice {n.faixa}</span>
            <span className="flex-1 text-sm text-muted">{n.desc}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
