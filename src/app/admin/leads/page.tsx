import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreLead } from "@/lib/metrics";
import { NIVEL_META } from "@/lib/scoring";
import AdminShell from "../AdminShell";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const admin = await requireAdmin();

  const leads = await prisma.respondente.findMany({
    where: { origem: "PUBLICO", respondeu: true },
    orderBy: { respondidoEm: "desc" },
    include: { respostas: { include: { pergunta: { select: { pilar: true } } } } },
  });

  return (
    <AdminShell nome={admin.nome}>
      <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
      <p className="mt-1 text-sm text-muted">
        Pessoas que responderam pela landing e aguardam contato.
      </p>

      {leads.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-3 text-sm text-muted">Nenhum lead respondeu ainda.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-medium">Lead</th>
                <th className="px-5 py-3 font-medium">Empresa</th>
                <th className="px-5 py-3 font-medium">Perfil</th>
                <th className="px-5 py-3 font-medium">Risco por pilar</th>
                <th className="px-5 py-3 font-medium">Quando</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const scores = scoreLead(l.respostas);
                return (
                  <tr key={l.id} className="border-b border-border last:border-0 transition hover:bg-background">
                    <td className="px-5 py-4">
                      <p className="font-medium">{l.contatoNome ?? "—"}</p>
                      <p className="text-xs text-muted">{l.contatoEmail}</p>
                    </td>
                    <td className="px-5 py-4 text-muted">{l.contatoEmpresa ?? "—"}</td>
                    <td className="px-5 py-4 text-muted">
                      {l.tipo === "LIDER" ? "Líder" : "Colaborador"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        {scores.map((s) => (
                          <span
                            key={s.pilar}
                            title={`${s.pilar}: ${s.indice.toFixed(0)}`}
                            className="flex h-7 w-9 items-center justify-center rounded text-[11px] font-semibold"
                            style={{ background: NIVEL_META[s.nivel].bg, color: NIVEL_META[s.nivel].cor }}
                          >
                            {s.indice.toFixed(0)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {l.respondidoEm?.toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/leads/${l.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
                        Abrir <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
