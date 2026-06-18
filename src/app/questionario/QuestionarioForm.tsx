"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock } from "lucide-react";
import { OPCOES, type ValorResposta } from "@/lib/scoring";
import { submeterQuestionario } from "@/lib/actions";

type Grupo = {
  pilar: string;
  nome: string;
  perguntas: { id: number; texto: string }[];
};

export default function QuestionarioForm({
  token,
  tipo,
  grupos,
}: {
  token: string;
  tipo: "COLABORADOR" | "LIDER";
  grupos: Grupo[];
}) {
  const router = useRouter();
  const [respostas, setRespostas] = useState<Record<number, ValorResposta>>({});
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const total = useMemo(
    () => grupos.reduce((acc, g) => acc + g.perguntas.length, 0),
    [grupos]
  );
  const respondidas = Object.keys(respostas).length;
  const progresso = total ? Math.round((respondidas / total) * 100) : 0;

  function escolher(perguntaId: number, valor: ValorResposta) {
    setRespostas((r) => ({ ...r, [perguntaId]: valor }));
  }

  async function enviar() {
    setErro(null);
    if (respondidas < total) {
      setErro("Responda todas as perguntas antes de enviar.");
      const faltante = grupos
        .flatMap((g) => g.perguntas)
        .find((p) => !respostas[p.id]);
      if (faltante) {
        document
          .getElementById(`p-${faltante.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setEnviando(true);
    const res = await submeterQuestionario(token, respostas);
    if (res.ok) {
      router.push("/obrigado");
    } else {
      setErro(res.erro ?? "Não foi possível enviar. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-brand">
                  Análise de Risco Psicossocial
                </p>
                <p className="text-[11px] uppercase tracking-wider text-muted">
                  Questionário {tipo === "LIDER" ? "de Liderança" : "do Colaborador"}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-muted">
              {respondidas}/{total}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-brand-2 transition-all"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-8">
        <div className="flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm text-muted">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-brand-2" />
          <p>
            Suas respostas são <strong className="text-foreground">anônimas</strong>.
            Não coletamos nome, CPF ou qualquer dado que identifique você. Responda
            com sinceridade — não há respostas certas ou erradas.
          </p>
        </div>

        {grupos.map((g, gi) => {
          let contador = 0;
          for (let i = 0; i < gi; i++) contador += grupos[i].perguntas.length;
          return (
            <section key={g.pilar} className="mt-10">
              <h2 className="text-lg font-bold text-brand">{g.nome}</h2>
              <div className="mt-4 space-y-4">
                {g.perguntas.map((p, pi) => {
                  const num = contador + pi + 1;
                  const selecionada = respostas[p.id];
                  return (
                    <div
                      id={`p-${p.id}`}
                      key={p.id}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-muted">{num}.</span> {p.texto}
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-5">
                        {OPCOES.map((o) => {
                          const ativo = selecionada === o.valor;
                          return (
                            <button
                              key={o.valor}
                              type="button"
                              onClick={() => escolher(p.id, o.valor)}
                              className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                                ativo
                                  ? "border-brand bg-brand text-white"
                                  : "border-border bg-background text-muted hover:border-brand/40 hover:text-foreground"
                              }`}
                            >
                              {o.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          {erro ? (
            <p className="text-sm font-medium text-red-600">{erro}</p>
          ) : (
            <p className="text-sm text-muted">
              {respondidas === total
                ? "Tudo respondido. Pode enviar."
                : `Faltam ${total - respondidas} perguntas.`}
            </p>
          )}
          <button
            type="button"
            onClick={enviar}
            disabled={enviando}
            className="rounded-md bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar respostas"}
          </button>
        </div>
      </div>
    </div>
  );
}
