"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const ITENS = [
  {
    q: "Minha empresa pode ser autuada se não mapear os riscos psicossociais?",
    a: "Sim. A NR-1, atualizada em 2024, tornou o gerenciamento de riscos psicossociais parte obrigatória do GRO (Gerenciamento de Riscos Ocupacionais). Empresas sem esse mapeamento estão em não-conformidade e sujeitas a autuações, multas e maior exposição em ações trabalhistas.",
  },
  {
    q: "Como sei se estamos realmente em conformidade com a NR-1?",
    a: "A conformidade exige evidência documentada de que o mapeamento foi feito, com base metodológica auditável. Ao final, entregamos um laudo assinado por advogado e psicóloga, com declaração de conformidade ou não-conformidade e o enquadramento legal aplicável.",
  },
  {
    q: "As respostas dos colaboradores são mesmo anônimas?",
    a: "No diagnóstico aplicado à sua empresa, cada pessoa responde por um acesso individual e os resultados são analisados de forma agregada por pilar e por público. Não vinculamos respostas a nomes — o objetivo é medir risco organizacional, não avaliar indivíduos.",
  },
  {
    q: "Burnout e assédio moral podem virar passivo trabalhista?",
    a: "Sim, e é uma tendência crescente. Adoecimento psíquico, assédio moral e burnout estão entre as principais causas de ações relacionadas ao ambiente de trabalho. O laudo e o plano de ação reduzem significativamente essa exposição ao demonstrar gestão ativa do risco.",
  },
  {
    q: "O que exatamente minha empresa recebe ao final?",
    a: "Diagnóstico quantitativo (índice de risco por pilar e público), diagnóstico qualitativo (narrativas das entrevistas), plano de ação priorizado para cada pilar de risco e o laudo final assinado por advogado e psicóloga com registro profissional.",
  },
  {
    q: "Vocês também executam os treinamentos e intervenções?",
    a: "Nosso serviço entrega o diagnóstico e o plano de ação. A execução das intervenções é responsabilidade da empresa ou de parceiros que indicamos — assim mantemos a isenção da análise e do laudo.",
  },
];

export default function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);
  return (
    <div className="mt-10 border-t border-border">
      {ITENS.map((item, i) => {
        const open = aberto === i;
        return (
          <div key={item.q} className="border-b border-border">
            <button
              onClick={() => setAberto(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
            >
              <span className="text-base font-medium text-ink">{item.q}</span>
              <span className="shrink-0 text-accent">
                {open ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 text-sm leading-relaxed text-muted">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
