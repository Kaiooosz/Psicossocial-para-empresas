import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/metrics";
import {
  NIVEL_META,
  NOME_PILAR,
  PONTUACAO,
  type Pilar,
  type ValorResposta,
  nivelRisco,
} from "@/lib/scoring";
import AdminShell from "../../AdminShell";

export const dynamic = "force-dynamic";

const PILARES: Pilar[] = ["CULTURA", "ORGANIZACAO", "METAS", "LIDERANCA"];

const LABEL_RESPOSTA: Record<ValorResposta, string> = {
  CONCORDO: "Concordo",
  CONCORDO_PARCIAL: "Conc. Parc.",
  NEUTRO: "Neutro",
  DISCORDO_PARCIAL: "Disc. Parc.",
  DISCORDO_TOTAL: "Discordo",
};

const SINAL_RISCO: Record<ValorResposta, { label: string; cor: string }> = {
  CONCORDO: { label: "ALTO", cor: "#b91c1c" },
  CONCORDO_PARCIAL: { label: "MEDIO", cor: "#c2410c" },
  NEUTRO: { label: "--", cor: "#94a3b8" },
  DISCORDO_PARCIAL: { label: "BAIXO", cor: "#a16207" },
  DISCORDO_TOTAL: { label: "SEM RISCO", cor: "#15803d" },
};

function soDigitos(s: string) {
  return s.replace(/\D/g, "");
}

export default async function LeadDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;

  const lead = await prisma.respondente.findUnique({
    where: { id },
    include: {
      respostas: {
        include: { pergunta: true },
        orderBy: [{ pergunta: { pilar: "asc" } }, { pergunta: { ordem: "asc" } }],
      },
    },
  });
  if (!lead || lead.origem !== "PUBLICO") notFound();

  const scores = scoreLead(lead.respostas);
  const wa = lead.contatoTelefone ? soDigitos(lead.contatoTelefone) : null;

  // Agrupa respostas por pilar
  const porPilar = PILARES.map((pilar) => {
    const respostas = lead.respostas
      .filter((r) => r.pergunta.pilar === pilar)
      .sort((a, b) => a.pergunta.ordem - b.pergunta.ordem);
    const soma = respostas.reduce((acc, r) => acc + r.pontuacao, 0);
    const score = scores.find((s) => s.pilar === pilar)!;
    return { pilar, nome: NOME_PILAR[pilar], respostas, soma, score };
  });

  const indiceGeral =
    scores.reduce((acc, s) => acc + s.indice, 0) / scores.length;
  const nivelGeral = nivelRisco(indiceGeral);
  const metaGeral = NIVEL_META[nivelGeral];

  return (
    <AdminShell nome={admin.nome}>
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      {/* Cabeçalho do relatório */}
      <div className="mt-6 rounded-xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              Relatório Individual · NR-1
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">
              {lead.contatoNome ?? "Lead"}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {lead.tipo === "LIDER" ? "Líder / Gestor" : "Colaborador"} ·{" "}
              {lead.contatoEmpresa ?? "Empresa não informada"} ·{" "}
              {lead.contatoCargo && `${lead.contatoCargo} · `}
              {lead.respondidoEm?.toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="flex gap-2">
            {lead.contatoEmail && (
              <a
                href={`mailto:${lead.contatoEmail}`}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/40"
              >
                <Mail className="h-4 w-4" /> {lead.contatoEmail}
              </a>
            )}
            {wa && (
              <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> {lead.contatoTelefone}
              </a>
            )}
          </div>
        </div>

        {/* Resumo geral */}
        <div className="mt-6 grid gap-3 sm:grid-cols-5">
          {scores.map((s) => {
            const meta = NIVEL_META[s.nivel];
            return (
              <div
                key={s.pilar}
                className="rounded-lg border border-border p-4"
                style={{ background: meta.bg }}
              >
                <p className="text-2xl font-bold tabular-nums" style={{ color: meta.cor }}>
                  {s.indice.toFixed(1)}
                </p>
                <p className="text-xs font-semibold" style={{ color: meta.cor }}>
                  {meta.label}
                </p>
                <p className="mt-1 text-[11px] text-foreground/60">
                  {NOME_PILAR[s.pilar]}
                </p>
              </div>
            );
          })}
          <div
            className="rounded-lg border-2 p-4"
            style={{ borderColor: metaGeral.cor, background: metaGeral.bg }}
          >
            <p className="text-2xl font-bold tabular-nums" style={{ color: metaGeral.cor }}>
              {indiceGeral.toFixed(1)}
            </p>
            <p className="text-xs font-semibold" style={{ color: metaGeral.cor }}>
              {metaGeral.label}
            </p>
            <p className="mt-1 text-[11px] text-foreground/60">Geral</p>
          </div>
        </div>
      </div>

      {/* Tabelas por pilar — espelho do dossiê */}
      {porPilar.map((grupo) => {
        const meta = NIVEL_META[grupo.score.nivel];
        return (
          <div key={grupo.pilar} className="mt-10">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-bold tracking-tight text-ink">
                {grupo.nome}
              </h2>
              <div className="flex items-baseline gap-3">
                <span
                  className="rounded-md px-2.5 py-1 text-xs font-bold"
                  style={{ background: meta.bg, color: meta.cor }}
                >
                  {meta.label}
                </span>
                <span className="text-lg font-bold tabular-nums" style={{ color: meta.cor }}>
                  {grupo.soma.toFixed(1)}/100
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted">
                    <th className="w-10 px-4 py-3 text-center font-medium">N</th>
                    <th className="px-4 py-3 font-medium">Pergunta</th>
                    <th className="w-28 px-4 py-3 font-medium">Resposta</th>
                    <th className="w-16 px-4 py-3 text-center font-medium">Pontos</th>
                    <th className="w-24 px-4 py-3 text-center font-medium">Sinal</th>
                  </tr>
                </thead>
                <tbody>
                  {grupo.respostas.map((r) => {
                    const valor = r.valor as ValorResposta;
                    const sinal = SINAL_RISCO[valor];
                    return (
                      <tr
                        key={r.id}
                        className="border-b border-border last:border-0 transition hover:bg-background"
                      >
                        <td className="px-4 py-3 text-center text-xs text-muted">
                          {r.pergunta.ordem}
                        </td>
                        <td className="px-4 py-3 text-sm text-ink">
                          {r.pergunta.texto}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                              valor === "CONCORDO"
                                ? "bg-red-100 text-red-700"
                                : valor === "CONCORDO_PARCIAL"
                                  ? "bg-orange-100 text-orange-700"
                                  : valor === "DISCORDO_PARCIAL"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : valor === "DISCORDO_TOTAL"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {LABEL_RESPOSTA[valor]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium tabular-nums text-ink">
                          {r.pontuacao.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className="text-xs font-bold"
                            style={{ color: sinal.cor }}
                          >
                            {sinal.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-background">
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-ink">
                      Total do pilar
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold tabular-nums text-ink">
                      {grupo.soma.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="text-xs font-bold"
                        style={{ color: meta.cor }}
                      >
                        {meta.label}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })}

      {/* Legenda */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-ink">Lógica de Pontuação</h3>
        <p className="mt-2 text-xs text-muted">
          Todas as perguntas são formuladas em sentido negativo. Concordar indica
          presença de risco; discordar indica ausência.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-background text-left text-[10px] uppercase tracking-wider text-muted">
                <th className="px-4 py-2 font-medium">Resposta</th>
                <th className="px-4 py-2 text-center font-medium">Pontos</th>
                <th className="px-4 py-2 text-center font-medium">Sinal</th>
                <th className="px-4 py-2 font-medium">O que significa</th>
              </tr>
            </thead>
            <tbody>
              {([
                ["Concordo", "6.667", "ALTO", "Confirma o problema. Risco presente.", "#b91c1c"],
                ["Concordo Parcialmente", "3.333", "MEDIO", "Problema existe, mas não é total.", "#c2410c"],
                ["Neutro", "0", "--", "Sem posicionamento. Não contabiliza.", "#94a3b8"],
                ["Discordo Parcialmente", "3.333", "BAIXO", "Discorda com ressalvas. Risco em grau baixo.", "#a16207"],
                ["Discordo Totalmente", "0", "SEM RISCO", "Nega completamente o problema.", "#15803d"],
              ] as const).map(([resp, pts, sinal, desc, cor]) => (
                <tr key={resp} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium text-ink">{resp}</td>
                  <td className="px-4 py-2 text-center tabular-nums text-ink">{pts}</td>
                  <td className="px-4 py-2 text-center font-bold" style={{ color: cor }}>
                    {sinal}
                  </td>
                  <td className="px-4 py-2 text-muted">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-muted">
          Metodologia e Propriedade Intelectual de Anna Clara Silva Freitas ·
          Confidencial · Uso Restrito
        </p>
      </div>
    </AdminShell>
  );
}
