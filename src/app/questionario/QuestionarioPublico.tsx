"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ArrowRight, Users, Briefcase } from "lucide-react";
import { OPCOES, type ValorResposta } from "@/lib/scoring";
import { submeterPublico, type ContatoLead } from "@/lib/actions";

type Grupo = {
  pilar: string;
  nome: string;
  perguntas: { id: number; texto: string }[];
};
type Sets = { COLABORADOR: Grupo[]; LIDER: Grupo[] };

export default function QuestionarioPublico({ sets }: { sets: Sets }) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<"dados" | "perguntas">("dados");
  const [tipo, setTipo] = useState<"COLABORADOR" | "LIDER" | null>(null);
  const [form, setForm] = useState({ nome: "", empresa: "", cargo: "", email: "", telefone: "" });
  const [respostas, setRespostas] = useState<Record<number, ValorResposta>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const grupos = tipo ? sets[tipo] : [];
  const total = useMemo(() => grupos.reduce((a, g) => a + g.perguntas.length, 0), [grupos]);
  const respondidas = Object.keys(respostas).length;
  const progresso = total ? Math.round((respondidas / total) * 100) : 0;

  function set(campo: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [campo]: v }));
  }

  function continuar() {
    setErro(null);
    if (!form.nome.trim() || !form.email.trim() || !form.telefone.trim()) {
      setErro("Preencha nome, e-mail e WhatsApp.");
      return;
    }
    if (!tipo) {
      setErro("Selecione seu perfil.");
      return;
    }
    setRespostas({});
    setEtapa("perguntas");
    window.scrollTo({ top: 0 });
  }

  async function enviar() {
    setErro(null);
    if (respondidas < total) {
      setErro("Responda todas as perguntas antes de enviar.");
      const faltante = grupos.flatMap((g) => g.perguntas).find((p) => !respostas[p.id]);
      if (faltante) document.getElementById(`p-${faltante.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setEnviando(true);
    const contato: ContatoLead = { ...form, tipo: tipo! };
    const res = await submeterPublico(contato, respostas);
    if (res.ok) router.push("/obrigado");
    else {
      setErro(res.erro ?? "Não foi possível enviar.");
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Image src="/bblaw-preto.svg" alt="Bezerra Borges Advogados" width={505} height={239} unoptimized className="h-7 w-auto" />
            {etapa === "perguntas" && (
              <span className="text-sm font-medium text-muted">{respondidas}/{total}</span>
            )}
          </div>
          {etapa === "perguntas" && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full bg-accent transition-all" style={{ width: `${progresso}%` }} />
            </div>
          )}
        </div>
      </header>

      {etapa === "dados" ? (
        <main className="mx-auto max-w-xl px-6 pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">Análise de Risco Psicossocial · NR-1</p>
          <h1 className="mt-3 text-2xl font-semibold text-ink">Responda e receba o contato do escritório</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Leva poucos minutos. Ao final, a equipe do Bezerra Borges Advogados entra em contato com o panorama da sua empresa.
          </p>

          <div className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Nome" value={form.nome} onChange={(v) => set("nome", v)} placeholder="Seu nome" />
              <Campo label="Empresa" value={form.empresa} onChange={(v) => set("empresa", v)} placeholder="Nome da empresa" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="E-mail" value={form.email} onChange={(v) => set("email", v)} placeholder="voce@empresa.com" type="email" />
              <Campo label="WhatsApp" value={form.telefone} onChange={(v) => set("telefone", v)} placeholder="(11) 90000-0000" />
            </div>
            <Campo label="Cargo (opcional)" value={form.cargo} onChange={(v) => set("cargo", v)} placeholder="Sua função" />
          </div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.18em] text-accent">Seu perfil na empresa</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Perfil ativo={tipo === "COLABORADOR"} onClick={() => setTipo("COLABORADOR")} icon={<Users className="h-5 w-5" />} titulo="Colaborador" desc="Atuo na operação, sem equipe sob gestão." />
            <Perfil ativo={tipo === "LIDER"} onClick={() => setTipo("LIDER")} icon={<Briefcase className="h-5 w-5" />} titulo="Líder / Gestor" desc="Lidero pessoas ou uma equipe." />
          </div>

          {erro && <p className="mt-5 text-sm font-medium text-red-600">{erro}</p>}

          <button
            onClick={continuar}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Começar as perguntas <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" /> Seus dados são usados apenas para o contato do escritório.
          </p>
        </main>
      ) : (
        <main className="mx-auto max-w-3xl px-6 pt-8">
          <div className="flex items-start gap-2 rounded-lg border border-border bg-card p-4 text-sm text-muted">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p>Responda com sinceridade — não há respostas certas ou erradas. Cada item descreve uma situação; diga o quanto concorda.</p>
          </div>

          {grupos.map((g, gi) => {
            let contador = 0;
            for (let i = 0; i < gi; i++) contador += grupos[i].perguntas.length;
            return (
              <section key={g.pilar} className="mt-10">
                <h2 className="text-lg font-semibold text-ink">{g.nome}</h2>
                <div className="mt-4 space-y-4">
                  {g.perguntas.map((p, pi) => {
                    const num = contador + pi + 1;
                    const sel = respostas[p.id];
                    return (
                      <div id={`p-${p.id}`} key={p.id} className="rounded-xl border border-border bg-card p-5">
                        <p className="text-sm font-medium text-ink"><span className="text-muted">{num}.</span> {p.texto}</p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-5">
                          {OPCOES.map((o) => {
                            const ativo = sel === o.valor;
                            return (
                              <button
                                key={o.valor}
                                type="button"
                                onClick={() => setRespostas((r) => ({ ...r, [p.id]: o.valor }))}
                                className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${ativo ? "border-ink bg-ink text-white" : "border-border bg-background text-muted hover:border-ink/40 hover:text-ink"}`}
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
      )}

      {etapa === "perguntas" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
            {erro ? (
              <p className="text-sm font-medium text-red-600">{erro}</p>
            ) : (
              <p className="text-sm text-muted">{respondidas === total ? "Tudo respondido. Pode enviar." : `Faltam ${total - respondidas} perguntas.`}</p>
            )}
            <button onClick={enviar} disabled={enviando} className="bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50">
              {enviando ? "Enviando..." : "Enviar respostas"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full border border-border bg-card px-3 py-2 text-sm text-ink outline-none focus:border-ink"
      />
    </label>
  );
}

function Perfil({ ativo, onClick, icon, titulo, desc }: { ativo: boolean; onClick: () => void; icon: React.ReactNode; titulo: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-2 border p-4 text-left transition ${ativo ? "border-ink bg-ink text-white" : "border-border bg-card text-ink hover:border-ink/40"}`}
    >
      <span className={ativo ? "text-white" : "text-accent"}>{icon}</span>
      <span className="text-sm font-semibold">{titulo}</span>
      <span className={`text-xs ${ativo ? "text-white/70" : "text-muted"}`}>{desc}</span>
    </button>
  );
}
