import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { relatorioEmpresa } from "@/lib/metrics";
import {
  NIVEL_META,
  NOME_PILAR,
  interpretarCruzamento,
  type Pilar,
} from "@/lib/scoring";
import AdminShell from "../../AdminShell";
import LinksRespondentes from "./LinksRespondentes";

export const dynamic = "force-dynamic";

const PILARES: Pilar[] = ["CULTURA", "ORGANIZACAO", "METAS", "LIDERANCA"];

function IndiceCard({
  indice,
  nivel,
  respondentes,
}: {
  indice: number | null;
  nivel: keyof typeof NIVEL_META;
  respondentes: number;
}) {
  const meta = NIVEL_META[nivel];
  return (
    <div
      className="rounded-lg border border-border p-4"
      style={{ background: meta.bg }}
    >
      <p className="text-2xl font-bold" style={{ color: meta.cor }}>
        {indice === null ? "—" : indice.toFixed(1)}
      </p>
      <p className="text-xs font-semibold" style={{ color: meta.cor }}>
        {meta.label}
      </p>
      <p className="mt-1 text-[11px] text-foreground/60">
        {respondentes} {respondentes === 1 ? "resposta" : "respostas"}
      </p>
    </div>
  );
}

export default async function EmpresaDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;

  const relatorio = await relatorioEmpresa(id);
  if (!relatorio) notFound();

  const respondentes = await prisma.respondente.findMany({
    where: { empresaId: id },
    orderBy: [{ tipo: "asc" }, { createdAt: "asc" }],
    select: { token: true, tipo: true, respondeu: true },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

  function indice(pilar: Pilar, publico: "COLABORADOR" | "LIDER") {
    return relatorio!.indices.find(
      (i) => i.pilar === pilar && i.publico === publico
    )!;
  }

  const perguntasOrdenadas = [...relatorio.perguntas].sort(
    (a, b) => b.percentual - a.percentual
  );

  return (
    <AdminShell nome={admin.nome}>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {relatorio.empresa.nome}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Início em{" "}
            {relatorio.empresa.inicioEm.toLocaleDateString("pt-BR")} ·{" "}
            {relatorio.empresa.status === "CONCLUIDO"
              ? "Concluído"
              : "Em andamento"}
          </p>
        </div>
      </div>

      {/* Taxa de resposta */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {relatorio.taxa.map((t) => (
          <div
            key={t.publico}
            className="rounded-xl border border-border bg-card p-5"
          >
            <p className="text-sm font-semibold">
              {t.publico === "LIDER" ? "Líderes" : "Colaboradores"}
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-sm text-muted">
                {t.responderam} de {t.enviados} responderam
              </p>
              <p className="text-2xl font-bold text-brand">
                {Math.round(t.percentual)}%
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-brand-2"
                style={{ width: `${t.percentual}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Índice por pilar */}
      <h2 className="mt-12 text-lg font-bold tracking-tight">
        Índice de risco por pilar
      </h2>
      <p className="mt-1 text-sm text-muted">
        Comparação entre a percepção de colaboradores e líderes (0 a 100).
      </p>
      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3 font-medium">Pilar</th>
              <th className="px-5 py-3 font-medium">Colaboradores</th>
              <th className="px-5 py-3 font-medium">Líderes</th>
            </tr>
          </thead>
          <tbody>
            {PILARES.map((pilar) => {
              const colab = indice(pilar, "COLABORADOR");
              const lider = indice(pilar, "LIDER");
              return (
                <tr
                  key={pilar}
                  className="border-b border-border last:border-0 align-top"
                >
                  <td className="px-5 py-4 font-medium">{NOME_PILAR[pilar]}</td>
                  <td className="w-44 px-5 py-4">
                    <IndiceCard
                      indice={colab.indice}
                      nivel={colab.nivel}
                      respondentes={colab.respondentes}
                    />
                  </td>
                  <td className="w-44 px-5 py-4">
                    <IndiceCard
                      indice={lider.indice}
                      nivel={lider.nivel}
                      respondentes={lider.respondentes}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cruzamento de percepção colaborador x líder */}
      <h2 className="mt-12 text-lg font-bold tracking-tight">
        Cruzamento de percepção
      </h2>
      <p className="mt-1 text-sm text-muted">
        Comparação entre o que colaboradores e líderes percebem em cada pilar, com
        a leitura do gap.
      </p>
      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
              <th className="px-5 py-3 font-medium">Pilar</th>
              <th className="px-5 py-3 font-medium">Colab.</th>
              <th className="px-5 py-3 font-medium">Líderes</th>
              <th className="px-5 py-3 font-medium">Gap</th>
              <th className="px-5 py-3 font-medium">Interpretação</th>
            </tr>
          </thead>
          <tbody>
            {PILARES.map((pilar) => {
              const colab = indice(pilar, "COLABORADOR");
              const lider = indice(pilar, "LIDER");
              const cruz = interpretarCruzamento(colab.indice, lider.indice);
              const gap =
                colab.indice !== null && lider.indice !== null
                  ? colab.indice - lider.indice
                  : null;
              return (
                <tr
                  key={pilar}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-4 font-medium">{NOME_PILAR[pilar]}</td>
                  <td className="px-5 py-4 tabular-nums text-muted">
                    {colab.indice === null ? "—" : colab.indice.toFixed(0)}
                  </td>
                  <td className="px-5 py-4 tabular-nums text-muted">
                    {lider.indice === null ? "—" : lider.indice.toFixed(0)}
                  </td>
                  <td className="px-5 py-4 tabular-nums font-medium">
                    {gap === null
                      ? "—"
                      : `${gap > 0 ? "+" : ""}${gap.toFixed(0)}`}
                  </td>
                  <td className="px-5 py-4 text-muted">{cruz.texto}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* % risco por pergunta */}
      <h2 className="mt-12 text-lg font-bold tracking-tight">
        Sinalização de risco por pergunta
      </h2>
      <p className="mt-1 text-sm text-muted">
        Percentual de respondentes que concordaram (total ou parcialmente) com
        cada afirmação de risco. Ordenado do maior para o menor.
      </p>
      {perguntasOrdenadas.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted">
          Ainda não há respostas para exibir.
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          {perguntasOrdenadas.map((p) => (
            <div
              key={p.perguntaId}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted">
                    {NOME_PILAR[p.pilar]} ·{" "}
                    {p.publico === "LIDER" ? "Líderes" : "Colaboradores"}
                  </p>
                  <p className="mt-1 text-sm">{p.texto}</p>
                </div>
                <span className="shrink-0 text-lg font-bold text-brand">
                  {Math.round(p.percentual)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full"
                  style={{
                    width: `${p.percentual}%`,
                    background:
                      p.percentual >= 70
                        ? "#b91c1c"
                        : p.percentual >= 50
                          ? "#a16207"
                          : "#0f766e",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Links */}
      <h2 className="mt-12 text-lg font-bold tracking-tight">
        Links dos respondentes
      </h2>
      <p className="mt-1 mb-5 text-sm text-muted">
        Cada link é único e anônimo. Envie um para cada pessoa por e-mail ou
        WhatsApp.
      </p>
      <LinksRespondentes itens={respondentes} baseUrl={baseUrl} />
    </AdminShell>
  );
}
